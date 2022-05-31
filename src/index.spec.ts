import hello from "./index"

describe("hello()", () => {
    test("Returns Hello World! by default", () => {
        expect(hello()).toBe("Hello World!");
    })

    test("Returns Hello Name when name provided", () => {
        expect(hello("Foo")).toBe("Hello Foo!");
    })
});