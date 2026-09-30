import React, { useCallback, useMemo } from "react";
import { Button, ButtonGroup, Classes, Dialog, DialogBody, InputGroup, Intent } from "@blueprintjs/core";
import { SearchResult } from "buttercup";
import cn from "classnames";
import styled from "styled-components";
import { t } from "../../../shared/i18n/trans.js";
import { copyTextToClipboard } from "../../services/clipboard.js";
import { getToaster } from "../../../shared/services/notifications.js";
import { localisedErrorMessage } from "../../../shared/library/error.js";
import { createNewTab } from "../../../shared/library/extension.js";
import { getOpenableURL } from "../../../shared/library/url.js";

interface EntryInfoDialogProps {
    entry: SearchResult | null;
    onClose: () => void;
}

interface EntryProperty {
    key: string;
    sensitive: boolean;
    title: string;
    url: string | null;
    value: string;
}

const InfoDialog = styled(Dialog)`
    max-width: 90%;
`;
const InfoDialogBody = styled(DialogBody)`
    display: flex;
    flex-direction: row;
    justify-content: stretch;
    align-items: flex-start;
    overflow-x: hidden;
`;
const InfoTable = styled.table`
    table-layout: fixed;
    width: 100%;
`;

export function EntryInfoDialog(props: EntryInfoDialogProps) {
    const { entry, onClose } = props;
    const properties = useMemo(() => entry ? orderProperties(entry.properties) : [], [entry]);
    const handleCopyClick = useCallback(async (property: string, value: string) => {
        try {
            await copyTextToClipboard(value);
            getToaster().show({
                intent: Intent.SUCCESS,
                message: t("popup.entries.info.copy-success", { property }),
                timeout: 4000
            });
        } catch (err) {
            getToaster().show({
                intent: Intent.DANGER,
                message: t("popup.entries.info.copy-error", { message: localisedErrorMessage(err) }),
                timeout: 10000
            });
        }
    }, []);
    const handleOpenClick = useCallback(async (url: string | null) => {
        if (!url) return;
        try {
            await createNewTab(url);
        } catch (err) {
            getToaster().show({
                intent: Intent.DANGER,
                message: t("popup.entries.info.open-error", { message: localisedErrorMessage(err) }),
                timeout: 10000
            });
        }
    }, []);
    return (
        <InfoDialog
            icon="info-sign"
            isCloseButtonShown
            isOpen={!!entry}
            onClose={onClose}
            title={entry?.properties.title ?? "Untitled Entry"}
        >
            <InfoDialogBody>
                <InfoTable className={cn(Classes.HTML_TABLE, Classes.COMPACT, Classes.HTML_TABLE_STRIPED)}>
                    <tbody>
                        {properties.map(property => (
                            <tr key={property.key}>
                                <td style={{ width: "100%" }}>
                                    {property.title}<br />
                                    <InputGroup
                                        type={property.sensitive ? "password" : "text"}
                                        value={property.value}
                                        readOnly
                                        rightElement={
                                            <ButtonGroup minimal>
                                                {property.url && (
                                                    <Button
                                                        icon="share"
                                                        onClick={() => handleOpenClick(property.url)}
                                                        title={t("popup.entries.info.open-tooltip")}
                                                    />
                                                )}
                                                <Button
                                                    icon="clipboard"
                                                    onClick={() => handleCopyClick(property.title, property.value)}
                                                    title={t("popup.entries.info.copy-tooltip")}
                                                />
                                            </ButtonGroup>
                                        }
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </InfoTable>
            </InfoDialogBody>
        </InfoDialog>
    );
}

function orderProperties(properties: Record<string, string>): Array<EntryProperty> {
    const working = { ...properties };
    delete working["title"];
    const output: Array<EntryProperty> = [];
    if (working["username"]) {
        output.push({
            key: "username",
            sensitive: false,
            title: "Username",
            url: null,
            value: properties["username"]
        });
        delete working["username"];
    }
    if (working["password"]) {
        output.push({
            key: "password",
            sensitive: true,
            title: "Password",
            url: null,
            value: properties["password"]
        });
        delete working["password"];
    }
    for (const prop in working) {
        output.push({
            key: prop,
            sensitive: false,
            title: prop,
            url: getOpenableURL(prop, working[prop]),
            value: working[prop]
        });
    }
    return output;
}
