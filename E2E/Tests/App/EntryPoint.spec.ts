import { BASE_URL } from "../../Config";
import { Page, expect, test } from "@playwright/test";
import URL from "Common/Types/API/URL";

const baseUrl: string = URL.fromString(BASE_URL.toString()).toString();

test.describe("Consolidated application entrypoint", () => {
  test("anonymous users enter through the accounts application", async ({
    page,
  }: {
    page: Page;
  }) => {
    await page.goto(baseUrl, { waitUntil: "domcontentloaded" });

    await expect(page).toHaveURL(/\/accounts\/login(?:[/?#]|$)/);
    await expect(page.getByTestId("email")).toBeVisible();
    await expect(page.getByTestId("password")).toBeVisible();
  });

  test("the direct registration route renders the accounts application", async ({
    page,
  }: {
    page: Page;
  }) => {
    const registerUrl: string = URL.fromString(baseUrl)
      .addRoute("/accounts/register")
      .toString();

    await page.goto(registerUrl, { waitUntil: "domcontentloaded" });

    await expect(page).toHaveURL(registerUrl);
    await expect(page.getByTestId("email")).toBeVisible();
    await expect(page.getByTestId("name")).toBeVisible();
    await expect(page.getByTestId("password")).toBeVisible();
    await expect(page.getByTestId("confirmPassword")).toBeVisible();
    await expect(page.getByTestId("Sign Up")).toBeVisible();
  });
});
