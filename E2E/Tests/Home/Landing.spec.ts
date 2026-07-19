import { BASE_URL } from "../../Config";
import { Page, expect, test } from "@playwright/test";
import URL from "Common/Types/API/URL";

test.beforeEach(async ({ page }: { page: Page }) => {
  page.setDefaultNavigationTimeout(120000); // 2 minutes
  await page.goto(URL.fromString(BASE_URL.toString()).toString());
});
test.describe("check if pages loades with its title", () => {
  test("has title", async ({ page }: { page: Page }) => {
    await expect(page).toHaveTitle(
      /Operations | One Complete SRE and DevOps platform./,
    );
  });
  test("operations link navigate to homepage", async ({
    page,
  }: {
    page: Page;
  }) => {
    await page
      .getByRole("link", { name: /Operations/ })
      .first()
      .click();

    await expect(page).toHaveURL(
      URL.fromString(BASE_URL.toString()).toString(),
    );
  });
});
