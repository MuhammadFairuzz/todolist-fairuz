document.addEventListener("DOMContentLoaded", function () {
  const taskForm = document.getElementById("task-form");
  const taskList = document.getElementById("task-list");
  const filterButtons = document.querySelector(".filter-buttons");
  const emptyListMessage = document.getElementById("empty-list-message");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  function updateTaskList() {
    taskList.innerHTML = ""; // Bersihkan daftar sebelum menampilkan ulang
    if (tasks.length === 0) {
      emptyListMessage.style.display = "block"; // Tampilkan pesan jika tidak ada tugas
    } else {
      emptyListMessage.style.display = "none"; // Sembunyikan pesan jika ada tugas
      tasks.forEach((task, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
                    <div class="task-details">
                        <span class="${task.completed ? "completed" : ""}">${
          task.description
        }</span>
                        <span class="task-duedate">Due: ${task.duedate}</span>
                    </div>
                    <div class="task-actions">
                        <button class="complete-button" data-index="${index}">${
          task.completed ? "Belum Selesai" : "Selesai"
        }</button>
                        <button class="delete-button" data-index="${index}">Hapus</button>
                    </div>
                `;
        taskList.appendChild(listItem);
      });
    }
  }

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    updateTaskList(); // Perbarui tampilan daftar setelah penyimpanan
  }

  taskForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const taskDescription = document.getElementById("task-description").value;
    const taskDuedate = document.getElementById("task-duedate").value;

    if (taskDescription.trim() === "") {
      alert("Deskripsi kegiatan tidak boleh kosong.");
      return;
    }

    const task = {
      description: taskDescription,
      duedate: taskDuedate,
      completed: false,
    };

    tasks.push(task);
    saveTasks();
    taskForm.reset();
  });

  taskList.addEventListener("click", function (e) {
    if (e.target.classList.contains("complete-button")) {
      const index = e.target.dataset.index;
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
    }

    if (e.target.classList.contains("delete-button")) {
      const index = e.target.dataset.index;
      tasks.splice(index, 1);
      saveTasks();
    }
  });
  filterButtons.addEventListener("click", function (e) {
    if (e.target.tagName === "BUTTON") {
      const filter = e.target.dataset.filter;
      document
        .querySelectorAll(".filter-buttons button")
        .forEach((btn) => btn.classList.remove("active"));
      e.target.classList.add("active");

      let filteredTasks;
      switch (filter) {
        case "pending":
          filteredTasks = tasks.filter((task) => !task.completed);
          break;
        case "completed":
          filteredTasks = tasks.filter((task) => task.completed);
          break;
        default:
          filteredTasks = [...tasks]; // Salin array agar tidak memodifikasi tasks asli
          break;
      }

      // Perbarui tampilan daftar dengan tugas yang telah difilter
      taskList.innerHTML = "";
      if (filteredTasks.length === 0) {
        emptyListMessage.style.display = "block";
      } else {
        emptyListMessage.style.display = "none";
        filteredTasks.forEach((task, index) => {
          const listItem = document.createElement("li");
          listItem.innerHTML = `
                        <div class="task-details">
                            <span class="${
                              task.completed ? "completed" : ""
                            }">${task.description}</span>
                            <span class="task-duedate">Due: ${
                              task.duedate
                            }</span>
                        </div>
                        <div class="task-actions">
                            <button class="complete-button" data-index="${tasks.indexOf(
                              task
                            )}">${
            task.completed ? "Belum Selesai" : "Selesai"
          }</button>
                            <button class="delete-button" data-index="${tasks.indexOf(
                              task
                            )}">Hapus</button>
                        </div>
                    `;
          taskList.appendChild(listItem);
        });
      }
    }
  });
  updateTaskList();
});
