import { useState, useEffect } from "react";

import {
  Button,
  Input,
  Checkbox,
  IconButton,
  Switch,
} from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

import axios from "axios";

function App() {
  const [data, setData] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const URL = "http://localhost:5000";

  const fetchData = async () => {
    await axios
      .get(`${URL}/api/tasks/`)
      .then((res) => {
        console.log(res.data);
        const { data } = res.data;
        setData(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onChange = ({ target }) => setNewTask(target.value);

  const onSubmit = async (e) => {
    e.preventDefault();

    // if (newTask.trim() === "") return;

    // const task = {
    //   id: Date.now(),
    //   title: newTask,
    //   isCompleted: false,
    // };

    // setData([...data, task]);
    // setNewTask("");

    // console.log(task);

    await axios
      .post(`${URL}/api/tasks/`, { title: newTask })
      .then((res) => {
        console.log(res.data);

        fetchData();
        setNewTask("");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onCheck = async (id) => {
    // setData((prevTasks) =>
    //   prevTasks.map((task) =>
    //     task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
    //   )
    // );

    await axios
      .put(`${URL}/api/tasks/${id}`)
      .then((res) => {
        console.log(res.data);

        fetchData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDelete = async (id) => {
    await axios
      .delete(`${URL}/api/tasks/${id}`)
      .then((res) => {
        console.log(res.data);

        fetchData();
      })
      .catch((err) => {
        console.log(err);
      });

    // console.log(id);
    // setData((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const handleDarkMode = () => {
    setDarkMode((prev) => {
      const isDark = !prev;
      const root = document.documentElement;

      if (isDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }

      //save to localStorage
      localStorage.setItem("darkMode", JSON.stringify(isDark));
      return isDark;
    });
  };

  useEffect(() => {
    fetchData();

    const stored = localStorage.getItem("darkMode");
    if (stored === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-100 text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
        <div className="container mx-auto">
          <div className="flex justify-end py-5 px-4">
            <FontAwesomeIcon
              icon={darkMode ? faMoon : faSun}
              className="dark:text-gray-200 text-gray-900 mr-5"
              size="lg"
            />
            <Switch
              size="lg"
              className="dark:bg-gray-200 bg-gray-900"
              onClick={handleDarkMode}
            />
          </div>
          <div className="flex flex-col justify-center text-center px-3 my-8">
            <div className="py-5">
              <h1 className="text-3xl font-bold dark:text-gray-200 text-gray-900 py-5">
                To Do App
              </h1>
              <div className="my-2">
                <div className="flex justify-center items-center my-7 mx-3">
                  <div className="w-[450px] flex flex-col mr-3">
                    <Input
                      size="lg"
                      color={darkMode ? "white" : "black"}
                      className="dark:bg-transparent dark:text-gray-200 bg-gray-100 text-gray-900"
                      label="Title"
                      name="title"
                      value={newTask}
                      onChange={onChange}
                      placeholder="New task..."
                    />
                  </div>
                  <Button
                    size="lg"
                    className={`${
                      newTask ? "disabled" : ""
                    } dark:bg-gray-200 dark:text-gray-900 bg-gray-900 text-gray-200`}
                    onClick={onSubmit}
                  >
                    Create
                  </Button>
                </div>
              </div>
            </div>
            {data.length > 0 ? (
              <div className="flex flex-col justify-center items-center my-2 mx-3">
                {data.map((data) => (
                  <div
                    className={`w-[100%] flex justify-between items-center px-5 py-3 border dark:border-gray-200 border-gray-900 mb-5`}
                    key={data._id}
                  >
                    <h5
                      className={`text-lg ${
                        data.isCompleted ? "line-through" : ""
                      }`}
                      onClick={onCheck}
                    >
                      {data.title}
                    </h5>
                    <div className="flex justify-between items-center">
                      <Checkbox
                        checked={data.isCompleted}
                        color={darkMode ? "white" : "black"}
                        onChange={() => onCheck(data._id)}
                        crossOrigin=""
                      />
                      <IconButton variant="text">
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="dark:text-gray-200 text-gray-900"
                          size="lg"
                          onClick={() => handleDelete(data._id)}
                        />
                      </IconButton>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center my-2 mx-3 dark:text-gray-200 text-gray-900">
                <h3 className="text-xl font-normal">No tasks found</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
