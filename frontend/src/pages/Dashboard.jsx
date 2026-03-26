import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [tasks, setTasks] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");
  const [taskStatus, setTaskStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [sort, setSort] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [darkMode, setDarkMode] = useState(false);

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    taskStatus: "Todo",
    priority: "Low",
    dueDate: ""
  });

  const handleChange = (e) => {
    setTaskForm({ ...taskForm, [e.target.name]: e.target.value });
  };

  // FETCH TASKS
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/tasks?search=${search}&taskStatus=${taskStatus}&priority=${priority}&page=${page}&sort=${sort}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setTasks(res.data.tasks);
      setTotalPages(res.data.totalPages);
      setError("");
    } catch (err) {
      setError("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  // ANALYTICS
  const fetchAnalytics = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/tasks/analytics",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setAnalytics(res.data);
    } catch (err) {
      toast.error("Failed to load analytics");
    }
  };

  // CREATE / UPDATE
  const saveTask = async () => {
    try {
      if (editId) {
        await axios.put(
          `http://localhost:5000/api/tasks/${editId}`,
          taskForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Task updated");
        setEditId(null);
      } else {
        await axios.post(
          "http://localhost:5000/api/tasks",
          taskForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Task created");
      }

      setTaskForm({
        title: "",
        description: "",
        taskStatus: "Todo",
        priority: "Low",
        dueDate: ""
      });

      fetchTasks();
      fetchAnalytics();

    } catch (err) {
      toast.error("Operation failed");
    }
  };

  // DELETE
  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    toast.success("Task deleted");
    fetchTasks();
    fetchAnalytics();
  };

  // DONE
  const markDone = async (id) => {
    await axios.put(
      `http://localhost:5000/api/tasks/${id}`,
      { taskStatus: "Done" },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success("Task completed");
    fetchTasks();
    fetchAnalytics();
  };

  // EDIT
  const editTask = (task) => {
    setTaskForm({
      title: task.title,
      description: task.description,
      taskStatus: task.taskStatus,
      priority: task.priority,
      dueDate: task.dueDate?.split("T")[0]
    });

    setEditId(task._id);
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    fetchTasks();
    fetchAnalytics();
  }, [page, sort]);

  return (
    <div className={darkMode ? "bg-dark text-light min-vh-100" : "bg-light min-vh-100"}>

      <ToastContainer />

      <div className="container-fluid px-4 py-3">

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Task Dashboard</h2>

          <div>
            <button
              className="btn btn-outline-secondary me-2"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>

            <button className="btn btn-dark" onClick={logout}>
              Logout
            </button>
          </div>
        </div>

        {/* ANALYTICS */}
        <div className="row g-3 mb-4">
          {[
            { label: "Total Tasks", value: analytics.totalTasks },
            { label: "Completed", value: analytics.completedTasks },
            { label: "Pending", value: analytics.pendingTasks },
            { label: "Progress", value: analytics.completionRate }
          ].map((item, i) => (
            <div className="col-md-3" key={i}>
              <div className="card shadow-sm border-0 p-3 text-center h-100">
                <h6 className="text-muted">{item.label}</h6>
                <h3 className="fw-bold">{item.value || 0}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* FORM + FILTERS SIDE BY SIDE */}
        <div className="row g-4 mb-4">

          {/* CREATE FORM */}
          <div className="col-lg-6">
            <div className="card shadow-sm border-0 p-4 h-100">
              <h5 className="mb-3">{editId ? "Update Task" : "Create Task"}</h5>

              <div className="row g-2">
                <div className="col-md-6">
                  <input className="form-control" name="title" placeholder="Title" value={taskForm.title} onChange={handleChange} />
                </div>

                <div className="col-md-6">
                  <input className="form-control" name="description" placeholder="Description" value={taskForm.description} onChange={handleChange} />
                </div>

                <div className="col-md-4">
                  <select className="form-control" name="taskStatus" value={taskForm.taskStatus} onChange={handleChange}>
                    <option>Todo</option>
                    <option>In Progress</option>
                    <option>Done</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <select className="form-control" name="priority" value={taskForm.priority} onChange={handleChange}>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <input type="date" className="form-control" name="dueDate" value={taskForm.dueDate} onChange={handleChange} />
                </div>
              </div>

              <button className="btn btn-primary mt-3 w-100" onClick={saveTask}>
                {editId ? "Update Task" : "Add Task"}
              </button>
            </div>
          </div>

          {/* FILTERS */}
          <div className="col-lg-6">
            <div className="card shadow-sm border-0 p-4 h-100">
              <h5 className="mb-3">Filters</h5>

              <div className="row g-2">
                <div className="col-md-6">
                  <input className="form-control" placeholder="Search..." onChange={(e) => setSearch(e.target.value)} />
                </div>

                <div className="col-md-6">
                  <select className="form-control" onChange={(e) => setTaskStatus(e.target.value)}>
                    <option value="">All Status</option>
                    <option>Todo</option>
                    <option>In Progress</option>
                    <option>Done</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <select className="form-control" onChange={(e) => setPriority(e.target.value)}>
                    <option value="">All Priority</option>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <select className="form-control" onChange={(e) => setSort(e.target.value)}>
                    <option value="">Sort By</option>
                    <option value="dueDate">Due Date</option>
                    <option value="priority">Priority</option>
                  </select>
                </div>
              </div>

              <button className="btn btn-secondary mt-3 w-100" onClick={fetchTasks}>
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* TASK LIST */}
        <div className="row g-3">
          {tasks.map((task) => (
            <div className="col-md-4 col-lg-3" key={task._id}>
              <div className="card shadow-sm border-0 p-3 h-100">

                <h5 className="fw-bold">{task.title}</h5>
                <p className="text-muted small">{task.description}</p>

                <div className="mb-2">
                  <span className="badge bg-primary me-1">{task.taskStatus}</span>
                  <span className="badge bg-warning text-dark">{task.priority}</span>
                </div>

                <div className="mt-auto d-flex justify-content-between">
                  <button className="btn btn-sm btn-outline-warning" onClick={() => editTask(task)}>Edit</button>

                  <button
                    className="btn btn-sm btn-outline-success"
                    disabled={task.taskStatus === "Done"}
                    onClick={() => markDone(task._id)}
                  >
                    Done
                  </button>

                  <button className="btn btn-sm btn-outline-danger" onClick={() => deleteTask(task._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        <div className="d-flex justify-content-center mt-4">
          <button className="btn btn-outline-secondary me-2" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
          <span className="mx-2">Page {page} / {totalPages}</span>
          <button className="btn btn-outline-secondary ms-2" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;