const choices = ["rock", "paper", "scissors"];
const result = document.getElementById("result");

document.querySelectorAll(".choice").forEach(btn => {
  btn.addEventListener("click", () => {
    const userChoice = btn.dataset.choice;
    const computerChoice = choices[Math.floor(Math.random() * 3)];

    let message = "";

    switch (userChoice + computerChoice) {
      case "rockscissors":
      case "paperrock":
      case "scissorspaper":
        message = "You win!";
        break;
      case "rockpaper":
      case "paperscissors":
      case "scissorsrock":
        message = "You lose!";
        break;
      default:
        message = "Draw!";
    }

    result.textContent = `You chose ${userChoice}, computer chose ${computerChoice}. ${message}`;
  });
});