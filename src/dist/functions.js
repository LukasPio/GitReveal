export async function getUser() {
    const userName = "LukasPio";
    const response = await fetch("https://api.github.com/users/chaharshivam");
    const user = await response.json();
    console.log(user);
}
