import Analytics from "../../Utils/Analytics";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import PageLoader from "../Loader/PageLoader";
import LabelElement from "../Label/Label";
import Link from "../../../Types/Link";
import LabelModel from "../../../Models/DatabaseModels/Label";
import useTranslateValue from "../../Utils/Translation";
import React, { FunctionComponent, ReactElement, useEffect } from "react";
import { CAST_OPERATIONS_EMBEDDED_MODE } from "../../Config";

export interface ComponentProps {
  title?: string | undefined;
  /*
   * Optional one-line subtitle rendered under the title. Use it to say what the
   * page is for when the title alone is not self-explanatory. Kept optional so
   * existing pages that carry their description in a content card are unchanged.
   */
  description?: string | undefined;
  breadcrumbLinks?: Array<Link> | undefined;
  children: Array<ReactElement> | ReactElement;
  sideMenu?: undefined | ReactElement;
  className?: string | undefined;
  isLoading?: boolean | undefined;
  error?: string | undefined;
  labels?: Array<LabelModel> | undefined;
  headerRight?: ReactElement | undefined;
}

const Page: FunctionComponent<ComponentProps> = (
  props: ComponentProps,
): ReactElement => {
  // Cast owns navigation when Operations is embedded. Rendering the feature
  // sidebar here would create a second navigation rail inside the Cast shell.
  const sideMenu: ReactElement | undefined = CAST_OPERATIONS_EMBEDDED_MODE
    ? undefined
    : props.sideMenu;
  const hideEmbeddedPageHeader: boolean =
    CAST_OPERATIONS_EMBEDDED_MODE && props.sideMenu !== undefined;
  const { translateString } = useTranslateValue();
  const translatedTitle: string | undefined = translateString(props.title);
  const translatedDescription: string | undefined = translateString(
    props.description,
  );

  useEffect(() => {
    if (props.breadcrumbLinks && props.breadcrumbLinks.length > 0) {
      Analytics.capture(
        "Page View: " +
          props.breadcrumbLinks
            .map((link: Link) => {
              return link.title;
            })
            .join(" > ")
            .toString() || "",
      );
    }
  }, [props.breadcrumbLinks]);

  /*
   * Give each page a unique, descriptive document title (WCAG 2.4.2 Page
   * Titled). Without this, every page keeps the generic title set once at app
   * startup (e.g. "OneUptime | Dashboard"), which does not describe the page.
   * Prefer the breadcrumb trail (most specific page last) and fall back to the
   * page title.
   */
  useEffect(() => {
    const breadcrumbTitle: string | undefined =
      props.breadcrumbLinks && props.breadcrumbLinks.length > 0
        ? props.breadcrumbLinks
            .map((link: Link) => {
              return translateString(link.title);
            })
            .filter((value: string | undefined): value is string => {
              return Boolean(value);
            })
            .join(" - ")
        : undefined;

    const pageTitle: string | undefined = breadcrumbTitle || translatedTitle;

    if (pageTitle) {
      document.title = CAST_OPERATIONS_EMBEDDED_MODE
        ? `Cast Operations | ${pageTitle}`
        : `OneUptime | ${pageTitle}`;
    }
  }, [translatedTitle, props.breadcrumbLinks]);

  if (props.error) {
    return <ErrorMessage message={props.error} />;
  }

  return (
    <div
      className={
        props.className ||
        (CAST_OPERATIONS_EMBEDDED_MODE
          ? "mb-auto max-w-full px-3 sm:px-4 lg:px-5 mt-2 h-max"
          : "mb-auto max-w-full px-4 sm:px-6 lg:px-8 mt-5 h-max")
      }
    >
      {!hideEmbeddedPageHeader &&
        ((props.breadcrumbLinks && props.breadcrumbLinks.length > 0) ||
          props.title) && (
        <div className={CAST_OPERATIONS_EMBEDDED_MODE ? "mb-3" : "mb-5"}>
          {!CAST_OPERATIONS_EMBEDDED_MODE &&
            props.breadcrumbLinks &&
            props.breadcrumbLinks.length > 0 && (
            <div className={CAST_OPERATIONS_EMBEDDED_MODE ? "mt-1" : "mt-2"}>
              <Breadcrumbs links={props.breadcrumbLinks} />
            </div>
            )}
          {props.title && (
            <div className="mt-2">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:flex-wrap sm:gap-4">
                <div className="flex flex-col gap-1 min-w-0">
                  <h1
                    className={`font-semibold text-gray-900 sm:tracking-tight sm:truncate ${
                      CAST_OPERATIONS_EMBEDDED_MODE
                        ? "text-lg leading-6"
                        : "text-xl leading-7 sm:text-xl"
                    }`}
                  >
                    {translatedTitle}
                  </h1>
                  {translatedDescription && (
                    <p className="max-w-3xl text-sm leading-6 text-gray-500">
                      {translatedDescription}
                    </p>
                  )}
                </div>
                {props.headerRight && (
                  <div className="flex flex-wrap items-center sm:justify-end gap-3">
                    {props.headerRight}
                  </div>
                )}
                {props.labels && props.labels.length > 0 && (
                  <div className="hidden sm:flex sm:flex-wrap sm:items-center sm:justify-end sm:gap-3">
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 whitespace-nowrap">
                      {translateString("Labels") || "Labels"}
                    </span>
                    <div className="flex flex-wrap items-center gap-2 justify-end">
                      {props.labels
                        .filter((label: LabelModel | null) => {
                          return Boolean(label && (label.name || label.slug));
                        })
                        .map((label: LabelModel, index: number) => {
                          return (
                            <LabelElement
                              key={
                                label.id?.toString() ||
                                label._id ||
                                label.slug ||
                                `${label.name || "label"}-${index}`
                              }
                              label={label}
                            />
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {sideMenu && (
        <div className="mx-auto max-w-full pb-10">
          <div
            className={`flex flex-col md:flex-row ${
              CAST_OPERATIONS_EMBEDDED_MODE
                ? "md:gap-3 lg:gap-4"
                : "md:gap-4 lg:gap-5"
            }`}
          >
            {sideMenu}

            {!props.isLoading && (
              <div className="space-y-6 flex-1 min-w-0">{props.children}</div>
            )}
            {props.isLoading && (
              <div className="flex-1 min-w-0">
                <PageLoader isVisible={true} />
              </div>
            )}
          </div>
        </div>
      )}

      {!sideMenu && !props.isLoading && props.children}
      {!sideMenu && props.isLoading && <PageLoader isVisible={true} />}
    </div>
  );
};

export default Page;
