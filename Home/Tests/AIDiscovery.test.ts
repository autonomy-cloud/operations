import {
  generateLlmsTxt,
  generateLlmsFullTxt,
  generateMcpManifest,
  generatePageMarkdown,
  generateCompareMarkdown,
  generateProductsJson,
  generateCompareIndexJson,
  RecentBlogPostLink,
} from "../Utils/AIDiscovery";
import PageSEOConfig from "../Utils/PageSEO";
import { getProductCompareSlugs } from "../Utils/ProductCompare";
import { JSONObject } from "Common/Types/JSON";

const homeUrl: string = "https://latticeruntime.com";

describe("AIDiscovery", () => {
  test("llms.txt lists products and machine-readable resources", () => {
    const posts: Array<RecentBlogPostLink> = [
      {
        title: "Some Post",
        description: "Some description",
        fileName: "2026-01-01-some-post",
      },
    ];
    const txt: string = generateLlmsTxt(homeUrl, posts);

    expect(txt).toContain("# Cast Operations");
    expect(txt).toContain("https://latticeruntime.com/product/monitoring.md");
    expect(txt).toContain("https://latticeruntime.com/.well-known/mcp.json");
    expect(txt).toContain("https://latticeruntime.com/docs/llms.txt");
    expect(txt).toContain("https://latticeruntime.com/llms-full.txt");
    expect(txt).toContain("https://latticeruntime.com/api/openapi/spec");
    expect(txt).toContain("/blog/post/2026-01-01-some-post/markdown");
  });

  test("llms.txt omits the blog section when no posts are available", () => {
    const txt: string = generateLlmsTxt(homeUrl, []);
    expect(txt).not.toContain("## Recent Blog Posts");
  });

  test("llms.txt normalizes a trailing slash on the home url", () => {
    const txt: string = generateLlmsTxt("https://latticeruntime.com/", []);
    expect(txt).toContain("https://latticeruntime.com/product/monitoring.md");
    expect(txt).not.toContain("https://latticeruntime.com//");
  });

  test("llms-full.txt includes product features and comparisons", () => {
    const txt: string = generateLlmsFullTxt(homeUrl, []);
    expect(txt).toContain("### Cast Operations Monitoring");
    expect(txt).toContain("### Cast Operations vs PagerDuty");
  });

  test("page markdown is generated from PageSEO data", () => {
    const md: string = generatePageMarkdown(
      PageSEOConfig["/product/monitoring"]!,
      homeUrl,
    );
    expect(md).toContain("# Cast Operations Monitoring");
    expect(md).toContain("## Features");
    expect(md).toContain("Canonical page: https://latticeruntime.com/product/monitoring");
  });

  test("compare markdown renders tables and returns null for unknown slugs", () => {
    const md: string | null = generateCompareMarkdown("pagerduty", homeUrl);
    expect(md).not.toBeNull();
    expect(md).toContain("# Cast Operations vs PagerDuty");
    expect(md).toContain("## Feature Comparison");

    expect(generateCompareMarkdown("not-a-real-product", homeUrl)).toBeNull();
  });

  test("mcp manifest points at the /mcp endpoint", () => {
    const manifest: JSONObject = generateMcpManifest(homeUrl);
    expect(manifest["endpoint"]).toBe("https://latticeruntime.com/mcp");
    expect(manifest["documentation"]).toBe(
      "https://latticeruntime.com/docs/ai/mcp-server",
    );
  });

  test("products json lists every product page with markdown urls", () => {
    const products: Array<JSONObject> = generateProductsJson(homeUrl)[
      "products"
    ] as Array<JSONObject>;
    expect(products.length).toBeGreaterThan(20);
    for (const product of products) {
      expect(product["markdownUrl"]).toMatch(/^https:\/\/visca\.ai\/.+\.md$/);
    }
  });

  test("compare index json lists every comparison slug", () => {
    const comparisons: Array<JSONObject> = generateCompareIndexJson(homeUrl)[
      "comparisons"
    ] as Array<JSONObject>;
    expect(comparisons.length).toBe(getProductCompareSlugs().length);
  });
});
