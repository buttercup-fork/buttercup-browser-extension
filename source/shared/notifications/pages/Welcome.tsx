import { Fragment } from "react";
import { t } from "../../i18n/trans.js";

export const TITLE = "notifications.page.welcome.title";

export function Page() {
    return (
        <Fragment>
            <p dangerouslySetInnerHTML={{ __html: t("notifications.page.welcome.line-1") }} />
            <p dangerouslySetInnerHTML={{ __html: t("notifications.page.welcome.line-2") }} />
            <p dangerouslySetInnerHTML={{ __html: t("notifications.page.welcome.line-3") }} />
            <p dangerouslySetInnerHTML={{ __html: t("notifications.page.welcome.line-4") }} />
            <p>- {t("notifications.page.welcome.signature")}</p>
        </Fragment>
    );
}
