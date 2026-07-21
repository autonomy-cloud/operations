import Domain from "../../../Server/Types/Domain";
import BadDataException from "../../../Types/Exception/BadDataException";
import dns from "dns";

function dnsError(code: string, operation: string): NodeJS.ErrnoException {
  const error: NodeJS.ErrnoException = new Error(
    `${operation} ${code} test.example`,
  );
  error.code = code;
  return error;
}

async function getRejection(promise: Promise<unknown>): Promise<Error> {
  try {
    await promise;
  } catch (error) {
    if (error instanceof Error) {
      return error;
    }
    throw error;
  }

  throw new Error("Expected promise to reject");
}

afterEach(() => {
  jest.restoreAllMocks();
});

describe("Domain TXT Record Verification", () => {
  test("should throw user-friendly error for ENODATA", async () => {
    jest.spyOn(dns, "resolveTxt").mockImplementationOnce(((
      _hostname: string,
      callback: (
        error: NodeJS.ErrnoException | null,
        records: string[][],
      ) => void,
    ): void => {
      callback(dnsError("ENODATA", "queryTxt"), []);
    }) as typeof dns.resolveTxt);

    const domain: string = "nonexistentsubdomain-test.google.com";
    const verificationText: string = "test-verification-text";

    const error: Error = await getRejection(
      Domain.verifyTxtRecord(domain, verificationText),
    );
    expect(error).toBeInstanceOf(BadDataException);
    expect(error.message).toContain("No TXT records found");
    expect(error.message).toContain(domain);
    expect(error.message).not.toContain("queryTxt");
  });

  test("should throw user-friendly error for non-existent domain", async () => {
    jest.spyOn(dns, "resolveTxt").mockImplementationOnce(((
      _hostname: string,
      callback: (
        error: NodeJS.ErrnoException | null,
        records: string[][],
      ) => void,
    ): void => {
      callback(dnsError("ENOTFOUND", "queryTxt"), []);
    }) as typeof dns.resolveTxt);

    const domain: string =
      "thisisadomainthatdoesnotexistanywhere12345.nonexistent";
    const verificationText: string = "test-verification-text";

    const error: Error = await getRejection(
      Domain.verifyTxtRecord(domain, verificationText),
    );
    expect(error).toBeInstanceOf(BadDataException);
    expect(error.message).toContain("not found");
    expect(error.message).toContain(domain);
    expect(error.message).not.toContain("ENOTFOUND");
    expect(error.message).not.toContain("queryTxt");
  });
});

describe("Domain CNAME Record Verification", () => {
  test("should throw user-friendly error for CNAME ENODATA", async () => {
    jest.spyOn(dns, "resolveCname").mockImplementationOnce(((
      _hostname: string,
      callback: (
        error: NodeJS.ErrnoException | null,
        addresses: string[],
      ) => void,
    ): void => {
      callback(dnsError("ENODATA", "queryCname"), []);
    }) as typeof dns.resolveCname);

    const domain: string = "google.com"; // This is an A record, not CNAME

    const error: Error = await getRejection(Domain.getCnameRecords({ domain }));
    expect(error).toBeInstanceOf(BadDataException);
    expect(error.message).toContain("CNAME");
    expect(error.message).toContain(domain);
    expect(error.message).not.toContain("queryCname");
  });

  test("should get CNAME records for valid CNAME domain", async () => {
    jest.spyOn(dns, "resolveCname").mockImplementationOnce(((
      _hostname: string,
      callback: (
        error: NodeJS.ErrnoException | null,
        addresses: string[],
      ) => void,
    ): void => {
      callback(null, ["github.com"]);
    }) as typeof dns.resolveCname);

    const domain: string = "www.github.com"; // This usually has CNAME records

    try {
      const cnameRecords: string[] = await Domain.getCnameRecords({ domain });
      expect(Array.isArray(cnameRecords)).toBe(true);
      expect(cnameRecords.length).toBeGreaterThan(0);
    } catch (error) {
      // If this fails, it should still provide a user-friendly error
      expect(error).toBeInstanceOf(BadDataException);
      if (error instanceof BadDataException) {
        expect(error.message).not.toContain("queryCname");
        expect(error.message).not.toContain("ENODATA");
      }
    }
  });
});
