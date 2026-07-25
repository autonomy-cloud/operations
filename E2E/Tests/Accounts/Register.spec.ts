import { BASE_URL, IS_USER_REGISTERED } from "../../Config";
import { Page, expect, test, Response } from "@playwright/test";
import URL from "Common/Types/API/URL";
import Faker from "Common/Utils/Faker";

test.describe("Account Registration", () => {
  test("should register a new account", async ({ page }: { page: Page }) => {
    if (IS_USER_REGISTERED) {
      // pass this test if user is already registered
      return;
    }

    const registerUrl: string = URL.fromString(BASE_URL.toString())
      .addRoute("/accounts/register")
      .toString();

    let pageResult: Response | null = null;

    for (let attempt: number = 1; attempt <= 10; attempt++) {
      pageResult = await page.goto(registerUrl, {
        waitUntil: "domcontentloaded",
      });

      if (pageResult?.status() !== 502 && pageResult?.status() !== 504) {
        break;
      }

      await page.waitForTimeout(1000);
    }

    expect(pageResult?.status()).not.toBe(502);
    expect(pageResult?.status()).not.toBe(504);
    await expect(page).toHaveURL(registerUrl);
    await expect(page.getByTestId("email")).toBeVisible();

    await page.getByTestId("email").click();
    await page.getByTestId("email").fill(Faker.generateEmail().toString());
    await page.getByTestId("email").press("Tab");
    await page.getByTestId("name").fill("sample");
    await page.getByTestId("name").press("Tab");

    await page.getByTestId("password").fill("sample");
    await page.getByTestId("password").press("Tab");
    await page.getByTestId("confirmPassword").fill("sample");
    await page.getByTestId("Sign Up").click();

    // wait for navigation with base url
    await page.waitForURL(
      URL.fromString(BASE_URL.toString())
        .addRoute("/dashboard/welcome")
        .toString(),
    );
    expect(page.url()).toBe(
      URL.fromString(BASE_URL.toString())
        .addRoute("/dashboard/welcome")
        .toString(),
    );

    await page.getByTestId("create-new-project-button").click();
  });
});
