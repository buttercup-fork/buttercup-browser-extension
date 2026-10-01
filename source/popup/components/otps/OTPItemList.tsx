import React, { Fragment } from "react";
import styled from "styled-components";
import { Divider, H4 } from "@blueprintjs/core";
import { t } from "../../../shared/i18n/trans.js";
import { OTPItem } from "./OTPItem.js";
import { PreparedOTP } from "../../hooks/otp.js";
import { OTP } from "../../types.js";

interface OTPItemListProps {
    onOTPClick: (otp: OTP) => void;
    otps: Array<PreparedOTP>;
    /** Number of leading OTPs that belong to the current site */
    siteCount?: number;
}

const ButtonRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-start;

    > button:not(:last-child) {
        margin-right: 6px;
    }
`;
const ScrollList = styled.div`
    max-height: 100%;
    // overflow-x: hidden;
    // overflow-y: scroll;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
`;

export function OTPItemList(props: OTPItemListProps) {
    const {
        onOTPClick,
        otps,
        siteCount = 0
    } = props;
    const showSections = siteCount > 0 && siteCount < otps.length;

    return (
        <>
            <ScrollList>
                {showSections && <H4>{t("popup.otps.sections.site")}</H4>}
                {otps.map((otp, index) => (
                    <Fragment key={`${otp.entryID}:${otp.otpURL}`}>
                        {showSections && index === siteCount && <H4>{t("popup.otps.sections.other")}</H4>}
                        <OTPItem
                            otp={otp}
                            onClick={() => onOTPClick(otp)}
                        />
                        <Divider />
                    </Fragment>
                ))}
            </ScrollList>
        </>
    );
}
