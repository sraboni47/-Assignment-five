let issuesList = [];

const renderLabels = (labels) => {
  const labelArr = labels.map((label) => {
    const lower = label.toLowerCase();

    const badgeClass =
      lower === "bug"
        ? "high"
        : lower === "help wanted"
        ? "medium"
        : lower === "enhancement"
        ? "next-eh"
        : lower === "documentation"
        ? "low"
        : "next-la";

    return `
      <div class="badge badge-sm text-xs ${badgeClass}">
        ${label.toUpperCase()}
      </div>
    `;
  });

  return labelArr.join(" ");
};

document.getElementById("tabs-container").addEventListener("click", (e) => {
  const selectedBtn = e.target.closest(".tabs-btn");

  if (!selectedBtn) return;

  const tabButtons = document.querySelectorAll(".tabs-btn");

  tabButtons.forEach((btn) => {
    btn.classList.add("btn-second");
    btn.classList.remove("btn-first");
  });

  selectedBtn.classList.add("btn-first");
  selectedBtn.classList.remove("btn-second");

  const tabName = selectedBtn.innerText.trim();

  if (tabName === "All") {
    displayAllIssues(issuesList);
    issuesCount("all");
  } 
  else if (tabName === "Open") {
    const openIssues = issuesList.filter((issue) => issue.status === "open");
    issuesCount("open");
    displayAllIssues(openIssues);
  } 
  else if (tabName === "Closed") {
    const closedIssues = issuesList.filter((issue) => issue.status === "closed");
    issuesCount("closed");
    displayAllIssues(closedIssues);
  }
});

function toggleModalSpinner(isLoading) {
  const modalContent = document.getElementById("modal-container");
  const modalLoader = document.getElementById("modal-loading-spinner");

  if (isLoading) {
    modalContent.classList.add("hidden");
    modalLoader.classList.remove("hidden");
  } else {
    modalContent.classList.remove("hidden");
    modalLoader.classList.add("hidden");
  }
}

const loadIssueDetails = async (issueId) => {
  document.getElementById("issue_modal").showModal();
  toggleModalSpinner(true);

  const url = `https://phi-lab-server.vercel.app/api/v1/lab/issue/${issueId}`;

  const response = await fetch(url);
  const result = await response.json();

  displayIssueDetails(result.data);
};

function displayIssueDetails(issue) {
  const modalBox = document.getElementById("modal-container");
  modalBox.innerHTML = "";

  const wrapper = document.createElement("div");

  wrapper.innerHTML = `
    <h2 class="text-2xl sm:text-3xl font-bold mb-4">${issue.title}</h2>

    <div class="flex items-center gap-3 text-sm text-gray-500 mb-6 flex-wrap">
      <div class="badge badge-lg rounded-full ${
        issue.status === "open" ? "bg-open" : "bg-closed"
      } font-medium">
        ${issue.status === "open" ? "Opened" : "Closed"}
      </div>

      <span>•</span>

      <span>
        Opened by <span class="font-semibold text-gray-700">${issue.author}</span>
      </span>

      <span>•</span>

      <span>${new Date(issue.createdAt).toLocaleDateString("en-US")}</span>
    </div>

    <div class="flex gap-2 mb-8">
      ${renderLabels(issue.labels)}
    </div>

    <p class="text-gray-500 text-lg mb-8">
      ${issue.description}
    </p>

    <div class="rounded-2xl p-3 sm:p-6 flex justify-between items-center mb-10">

      <div>
        <p class="text-gray-400 text-sm mb-1 font-semibold">ASSIGNEE</p>
        <p class="font-bold text-lg">
          ${issue.assignee ? issue.assignee : "Unassigned"}
        </p>
      </div>

      <div class="text-right">
        <p class="text-gray-400 text-sm mb-1 font-semibold">PRIORITY</p>

        <div class="badge badge-lg ${
          issue.priority === "high"
            ? "high"
            : issue.priority === "low"
            ? "low"
            : "medium"
        }">
          ${issue.priority.toUpperCase()}
        </div>
      </div>

    </div>

    <div class="modal-action">
      <form method="dialog">
        <button class="btn btn-first">Close</button>
      </form>
    </div>
  `;

  modalBox.append(wrapper);
  toggleModalSpinner(false);
}

const loadAllIssues = async () => {
  showLoadingSpinner(true);

  const api = "https://phi-lab-server.vercel.app/api/v1/lab/issues";

  const res = await fetch(api);
  const data = await res.json();

  issuesList = data.data;

  displayAllIssues(issuesList);
  issuesCount("all");
};

const loadSearchIssues = async () => {
  const searchText = document.getElementById("search-input").value;

  if (searchText === "") return;

  const api = `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`;

  const tabButtons = document.querySelectorAll(".tabs-btn");

  tabButtons.forEach((btn) => {
    btn.classList.add("btn-second");
    btn.classList.remove("btn-first");
  });

  showLoadingSpinner(true);

  const res = await fetch(api);
  const data = await res.json();

  displayAllIssues(data.data);
  issuesCount("search", data.data);

  document.getElementById("search-input").value = "";
};

function showLoadingSpinner(isLoading) {
  const cards = document.getElementById("card-container");
  const spinner = document.getElementById("loading-spinner");

  if (isLoading) {
    cards.classList.add("hidden");
    spinner.classList.remove("hidden");
  } else {
    cards.classList.remove("hidden");
    spinner.classList.add("hidden");
  }
}

function issuesCount(type, arr = []) {
  const total = document.getElementById("total-issues");

  if (type === "all") {
    total.innerText = issuesList.length;
  }

  else if (type === "open") {
    const openList = issuesList.filter((issue) => issue.status === "open");
    total.innerText = openList.length;
  }

  else if (type === "closed") {
    const closedList = issuesList.filter((issue) => issue.status === "closed");
    total.innerText = closedList.length;
  }

  else if (type === "search") {
    total.innerText = arr.length;
  }
}

function displayAllIssues(issueArray) {
  const container = document.getElementById("card-container");
  container.innerHTML = "";

  issueArray.forEach((issue) => {
    const card = document.createElement("div");

    card.innerHTML = `
      <div onclick="loadIssueDetails(${issue.id})"
      class="shadow-lg border border-gray-100 ${
        issue.status === "open" ? "high-border-top" : "low-border-top"
      } h-full hover:shadow-2xl hover:-translate-y-1 cursor-pointer transition-all duration-300 flex flex-col">

        <div class="card-upper p-3">

          <div class="card-head flex justify-between">

            <div>
              <img src="${
                issue.status === "open"
                  ? "Open-Status.png"
                  : "Closed-Status.png"
              }">
            </div>

            <div class="badge badge-lg ${
              issue.priority === "high"
                ? "high"
                : issue.priority === "low"
                ? "low"
                : "medium"
            }">
              ${issue.priority.toUpperCase()}
            </div>

          </div>

          <div class="card-middle space-y-4 grow">

            <div class="pt-2 space-y-1">
              <h2 class="font-semibold text-lg">${issue.title}</h2>

              <p class="text-sm text-gray-500 line-clamp-2">
                ${issue.description}
              </p>
            </div>

            <div class="flex flex-wrap gap-1">
              ${renderLabels(issue.labels)}
            </div>

          </div>
        </div>

        <div class="card-lower mt-auto">

          <hr class="text-gray-200 mb-4">

          <div class="p-3">
            <p class="text-gray-500">
              #${issue.id} by ${issue.author}
            </p>

            <p class="text-gray-500">
              ${new Date(issue.createdAt).toLocaleDateString("en-US")}
            </p>
          </div>

        </div>

      </div>
    `;

    container.appendChild(card);
  });

  showLoadingSpinner(false);
}

loadAllIssues();