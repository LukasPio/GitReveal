async function getUser() {
  // @ts-ignore
  const userName: string = document.getElementById("search-user").value;
  const response = await fetch(`https://api.github.com/users/${userName}`);
  const user = await response.json();
  if (user.message === "Not Found") {
    alert("Esse usuário não existe");
    throw new Error("This user don't exist");
  }
  const requiredData = {
    name: user.name,
    avatar: user.avatar_url,
    repositories: user.public_repos,
    followers: user.followers,
  };
  renderUser(requiredData);
}

async function getTopRepositories() {
  const name = document.querySelector("input").value;
  const apiUrl = `https://api.github.com/users/${name}/repos`;
  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(
      `A requisição falhou com o código de status: ${response.status}`,
    );
  }

  const allRepositories = await response.json();
  console.log();
  const sortRepositories = allRepositories.sort(
    (a, b) => b.stargazers_count - a.stargazers_count,
  );
  const topRepositories = sortRepositories.slice(0, 4);
  const topRepositoriesName = topRepositories.map((repo) => repo.name);

  return topRepositoriesName;
}

async function renderUser(user: {
  name: string;
  avatar: string;
  repositories: number;
  followers: number;
}) {
  const card_area = document.querySelector(".card-area");
  card_area.textContent = "";

  const userCardSection = document.createElement("section");
  userCardSection.className = "user-card";

  const cardHeaderDiv = document.createElement("div");
  cardHeaderDiv.className = "card-header";

  const userIconImg = document.createElement("img");
  userIconImg.src = user.avatar;
  userIconImg.alt = "user-icon";
  userIconImg.className = "user-icon";

  const userNameP = document.createElement("p");
  userNameP.className = "user-name";
  userNameP.textContent = `Name: ${user.name}`;

  cardHeaderDiv.appendChild(userIconImg);
  cardHeaderDiv.appendChild(userNameP);

  const userDetailsDiv = document.createElement("div");
  userDetailsDiv.className = "user-details";

  const followersP = document.createElement("p");
  followersP.className = "followers";
  followersP.textContent = `Followers: ${user.followers}`;

  const repositoryNumberP = document.createElement("p");
  repositoryNumberP.className = "repository-number";
  repositoryNumberP.textContent = `Public repositories: ${user.repositories}`;

  userDetailsDiv.appendChild(followersP);
  userDetailsDiv.appendChild(repositoryNumberP);

  // Crie o título "h1" e o texto
  const repositoriesTitleH1 = document.createElement("h1");
  repositoriesTitleH1.className = "repositories-title";
  repositoriesTitleH1.textContent = "Top 4 repositories:";

  // Crie o elemento "div" com a classe "user-repositories" e defina os parágrafos
  const userRepositoriesDiv = document.createElement("div");
  userRepositoriesDiv.className = "user-repositories";

  const repoNames = await getTopRepositories();

  for (const repoName of repoNames) {
    const oneRepoP = document.createElement("p");
    oneRepoP.className = "oneRepo";
    oneRepoP.textContent = "●" + repoName;
    userRepositoriesDiv.appendChild(oneRepoP);
  }

  // Adicione todos os elementos criados à seção "user-card"
  userCardSection.appendChild(cardHeaderDiv);
  userCardSection.appendChild(userDetailsDiv);
  userCardSection.appendChild(repositoriesTitleH1);
  userCardSection.appendChild(userRepositoriesDiv);

  // Adicione a seção "user-card" ao corpo do documento (DOM)
  card_area.appendChild(userCardSection);
}

const searchButton = document.querySelector("button");

searchButton.addEventListener("click", getUser);
