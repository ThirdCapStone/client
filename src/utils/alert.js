import "./alert.scss";
import { AccountInput } from "../components/tools/Input";
import { AccountButton } from "../components/tools/Button";
import withReactContent from "sweetalert2-react-content";
import {
  faCertificate,
  faLock,
  faUser,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import Account from "./http/account";
import {
  validateEmail,
  validateID,
  validatePWD,
  validatePWDCheck,
} from "./validator";

const MySwal = withReactContent(Swal);

const showAlert = (
  title,
  text,
  icon,
  confirmButtonText,
  width = 600,
  timer = 1000,
  timerProgressBar = false
) => {
  MySwal.fire({
    html: `<hr /><p>${text}`,
    title: title,
    icon: icon,
    width: width,
    confirmButtonText: confirmButtonText,
    showCancelButton: true,
    showDenyButton: true,
    timer: timer,
    timerProgressBar: timerProgressBar,
  });
};

const showForgotPWDAlert = async (title, text, icon, confirmButtonText) => {
  let [chatID, userID] = [false, ""];
  let [chatPWD, userPWD] = [false, ""];
  let [chatPWDCheck, userPWDCheck] = [false, ""];
  let [chatEmail, userEmail] = [false, ""];

  await MySwal.fire({
    icon: icon,
    html: (
      <div>
        <h1 style={{ color: "white" }}>{title}</h1>
        <hr style={{ backgroundColor: "white" }} />
        {text}
        <br />
        <br />
        <AccountInput
          type="text"
          className="id"
          icon={faUser}
          placeholder="아이디"
          isChat={chatID}
          onChange={(event) => (userID = event.target.value)}
          onBlur={() => (chatID = false)}
          onFocus={() => (chatID = true)}
          validate={validateID(userID)}
        />

        <AccountInput
          type="password"
          className="pwd"
          icon={faLock}
          placeholder="변경할 비밀번호"
          isChat={chatPWD}
          onChange={(event) => (userPWD = event.target.value)}
          onBlur={() => (chatPWD = false)}
          onFocus={() => (chatPWD = true)}
          validate={validatePWD(userPWD)}
        />

        <AccountInput
          type="password"
          className="pwd-check"
          icon={faLock}
          placeholder="비밀번호 재입력"
          isChat={chatPWDCheck}
          onChange={(event) => (userPWDCheck = event.target.value)}
          onBlur={() => (chatPWDCheck = false)}
          onFocus={() => (chatPWDCheck = true)}
          validate={validatePWDCheck(userPWD, userPWDCheck)}
        />
        <AccountInput
          type="text"
          className="email"
          icon={faEnvelope}
          placeholder="이메일"
          isChat={chatEmail}
          onChange={(event) => (userEmail = event.target.value)}
          onBlur={() => (chatEmail = false)}
          onFocus={() => (chatEmail = true)}
          validate={validateEmail(userEmail)}
          VerifyButton={
            <AccountButton
              type="button"
              text="이메일 확인"
              onClick={() => console.log("detected")}
            />
          }
        />
        <AccountButton
          type="submit"
          onClick={() => MySwal.close()}
          text={confirmButtonText}
        />
      </div>
    ),
    showCloseButton: true,
    showConfirmButton: false,
  });
};

const showEmailALert = async (
  email,
  title,
  text,
  icon,
  confirmButtonText,
  timer,
  timerProgressBar = false
) => {
  let timerInterval;
  let isChat = false;
  let verifyCode = "";

  await MySwal.fire({
    icon: icon,
    html: (
      <div>
        <h1 style={{ color: "white" }}>{title}</h1>
        <hr style={{ backgroundColor: "white" }} />
        {text}
        {
          <AccountInput
            type="text"
            className="verifyCode"
            icon={faCertificate}
            placeholder="인증코드 (6자리)"
            marginTop="5%"
            onChange={(event) => {
              verifyCode = event.target.value;
            }}
            isChat={isChat}
            onBlur={() => (isChat = false)}
            onFocus={() => (isChat = true)}
          />
        }
        남은 시간: <b className="left-time">{inputAlertTimer(timer)}</b>
        <AccountButton
          display="block"
          marginLeft="15%"
          type="submit"
          marginTop="5%"
          text={confirmButtonText}
          onClick={() => MySwal.close()}
        />
      </div>
    ),
    showCloseButton: true,
    showConfirmButton: false,
    timer: timer,
    timerProgressBar: timerProgressBar,
    didOpen: () => {
      timerInterval = setInterval(() => {
        const b = document.querySelector("b.left-time");
        timer -= 1000;
        b.textContent = inputAlertTimer(timer);
      }, 1000);
    },
    willClose: () => {
      clearInterval(timerInterval);
    },
  });

  return await Account.verifyEmail(email, verifyCode);
};

const minTwoDigits = (n) => {
  return (n < 10 ? "0" : "") + n;
};

const inputAlertTimer = (miliseconds) => {
  const seconds = Number(Math.floor(miliseconds / 1000).toFixed(0));
  const minutes = Number(Math.floor(seconds / 60).toFixed(0));

  return `${minutes}:${minTwoDigits(seconds % 60)}`;
};

export { showAlert, showForgotPWDAlert, showEmailALert, inputAlertTimer };