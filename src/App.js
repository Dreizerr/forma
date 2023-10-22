import "./nullstyle.scss";
import "./App.scss";
import Select from "react-select";
import { useState } from "react";
import { useIMask } from "react-imask";

function App() {
  const [isDone, setIsDone] = useState(false);
  const [student, setStudent] = useState("");
  const [cabinetLink, setCabinetLink] = useState("");
  const [phoneMaskOpt, setPhoneMaskOpt] = useState({ mask: "+{7}(000)000-00-00" });
  const [grade, setGrade] = useState("");
  const [email, setEmail] = useState("");
  const [institution, setInstitution] = useState({ value: "", label: "" });
  const schoolOptions = [
    {
      value: "Гимназия 32",
      label: "Гимназия 32",
    },
    {
      value: "Школа 24",
      label: "Школа 24",
    },
    {
      value: "Школа 14",
      label: "Школа 14",
    },
    {
      value: "Школа 57",
      label: "Школа 57",
    },
  ];
  const [submitError, setSubmitError] = useState("");

  const { ref: phoneInputRef, value: phone, setValue: setPhone } = useIMask(phoneMaskOpt);

  const submit = async (e) => {
    e.preventDefault();
    const requireInputs = [...document.querySelectorAll(`._req`)];
    const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const result = [...requireInputs].filter((item) => {
      if (item.value) {
        return true;
      }
      if (item.textContent && item.textContent !== "Выбрать учреждение...") {
        return true;
      }
    });
    if (result.length !== requireInputs.length) {
      setSubmitError("Заполните все обязательные поля!");
      return;
    }
    if (phone.length < 16) {
      setSubmitError("Номер указан неверно!");
      return;
    }
    if (!emailRegexp.test(email)) {
      setSubmitError("Почта указана неверно!");
      return;
    }
    const studentObject = {
      student,
      cabinetLink,
      grade,
      phone,
      email,
      institution: institution.value,
    };
    const response = await fetch("https://forma-5ba33-default-rtdb.europe-west1.firebasedatabase.app/students.json", {
      method: "POST",
      body: JSON.stringify(studentObject),
    });
    if (response.ok) {
      setIsDone(true);
    } else {
      setSubmitError("Что-то пошло не так, повторите попытку!");
    }
  };

  return !isDone ? (
    <div className="container">
      <h1 className="heading">Заполните форму</h1>
      <form noValidate onSubmit={submit} className="form">
        <Select
          onChange={setInstitution}
          className="req-star _req my-select-container"
          classNamePrefix={"my-select"}
          placeholder={"Выбрать учреждение..."}
          options={schoolOptions}
        />
        <label className="input-label">
          <div className="input-wrapper req-star">
            <input
              placeholder="Введите класс"
              className="input _req"
              value={grade}
              onChange={(e) => {
                setGrade(e.target.value);
              }}
              onFocus={() => {
                setSubmitError("");
              }}
              type="text"
            />
          </div>
        </label>
        <label className="input-label">
          <div className="input-wrapper req-star">
            <input
              placeholder="Введите ФИО"
              className="input _req"
              value={student}
              onChange={(e) => {
                setStudent(e.target.value);
              }}
              onFocus={() => {
                setSubmitError("");
              }}
              type="text"
            />
          </div>
        </label>
        <label className="input-label">
          <div className="input-wrapper req-star">
            <input
              placeholder="Введите почту"
              className="input _req"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              onFocus={() => {
                setSubmitError("");
              }}
              type="text"
            />
          </div>
        </label>
        <label className="input-label">
          <div className="input-wrapper req-star">
            <input
              ref={phoneInputRef}
              placeholder="Введите телефон"
              className="input _req"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
              }}
              onFocus={() => {
                setSubmitError("");
              }}
              type="text"
            />
          </div>
        </label>
        <label className="input-label">
          <div className="input-wrapper">
            <input
              placeholder="Введите ссылку на личный кабинет"
              className="input"
              value={cabinetLink}
              onChange={(e) => {
                setCabinetLink(e.target.value);
              }}
              onFocus={() => {
                setSubmitError("");
              }}
              type="text"
            />
          </div>
        </label>

        {submitError ? <div className="form__error">{submitError}</div> : false}
        <button className="submit-btn" type="submit">
          Отправить форму
        </button>
      </form>
    </div>
  ) : (
    <h1 className="heading">Спасибо!</h1>
  );
}

export default App;
