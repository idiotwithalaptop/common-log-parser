export default function hello(name = "World") : string {
    return `Hello ${name}!`
}

console.log(hello());