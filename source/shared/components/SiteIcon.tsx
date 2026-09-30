// Entry icon: the site's favicon, falling back to the entry type's icon. Same
// component as buttercup-desktop's vault SiteIcon (both originally from
// @buttercup/ui).
import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { DEFAULT_ENTRY_TYPE, EntryType } from "buttercup";
import ICON_LOGIN from "../../../resources/entry-types/login.png";
import ICON_WEBSITE from "../../../resources/entry-types/website.png";
import ICON_NOTE from "../../../resources/entry-types/note.png";
import ICON_SSH from "../../../resources/entry-types/ssh.png";
import ICON_CREDITCARD from "../../../resources/entry-types/credit-card.png";

const DYNAMIC_STATE_FAILED = 2;
const DYNAMIC_STATE_LOADED = 1;
const DYNAMIC_STATE_LOADING = 0;
const HOSTNAME = /^[a-z0-9-]+(\.[a-z0-9-]+)*$/i;
const ICON_TYPES = {
    [EntryType.Login]: ICON_LOGIN,
    [EntryType.Website]: ICON_WEBSITE,
    [EntryType.SSHKey]: ICON_SSH,
    [EntryType.Note]: ICON_NOTE,
    [EntryType.CreditCard]: ICON_CREDITCARD
};
const NOOP = () => {};

// Fetch the favicon straight from the entry's own site: no icon service, so
// no third party ever sees which sites a vault holds logins for. Null for
// anything that isn't a plain host name.
function getFaviconURL(domain: string | null): string | null {
    return domain && HOSTNAME.test(domain) ? `https://${domain}/favicon.ico` : null;
}

const FallbackIcon = styled.img<{ dynamicLoading: boolean }>`
    opacity: ${(props) => (props.dynamicLoading ? "0.5" : "1.0")};
`;
const IconContainer = styled.div`
    position: relative;
    > img {
        position: absolute;
        top: 0;
        left: 0;
    }
`;

export function SiteIcon(props) {
    const { className, domain = null, type = DEFAULT_ENTRY_TYPE } = props;
    const imgRef = useRef<HTMLImageElement | null>(null);
    const [dynamicState, setDynamicState] = useState(DYNAMIC_STATE_LOADING);
    const onImgError = useMemo(
        () => () => {
            if (!imgRef.current) return;
            imgRef.current.removeEventListener("error", onImgError);
            imgRef.current.removeEventListener("load", onImgLoad);
            setDynamicState(DYNAMIC_STATE_FAILED);
        },
        [imgRef.current]
    );
    const onImgLoad = useMemo(
        () => () => {
            if (!imgRef.current) return;
            imgRef.current.removeEventListener("error", onImgError);
            imgRef.current.removeEventListener("load", onImgLoad);
            setDynamicState(DYNAMIC_STATE_LOADED);
        },
        [imgRef.current]
    );
    useEffect(() => {
        const faviconURL = getFaviconURL(domain);
        if (!faviconURL) {
            setDynamicState(DYNAMIC_STATE_FAILED);
            return NOOP;
        }
        if (!imgRef.current) return NOOP;
        imgRef.current.addEventListener("error", onImgError);
        imgRef.current.addEventListener("load", onImgLoad);
        imgRef.current.setAttribute("src", faviconURL);
    }, [imgRef.current]);
    return (
        <IconContainer className={className}>
            {(dynamicState === DYNAMIC_STATE_LOADED || dynamicState === DYNAMIC_STATE_LOADING) && (
                <img ref={imgRef} loading="lazy" />
            )}
            {(dynamicState === DYNAMIC_STATE_FAILED || dynamicState === DYNAMIC_STATE_LOADING) && (
                <FallbackIcon src={ICON_TYPES[type]} dynamicLoading={dynamicState === DYNAMIC_STATE_LOADING} />
            )}
        </IconContainer>
    );
}
