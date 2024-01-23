import '../../globals.css'
import { useRouter } from "next/router"
import { useState } from "react"
import Link from 'next/link';
import Modal from 'react-modal';
// import 'react-modal/style.css';


export default function Signup() {
    const router = useRouter()
    const [state, setState] = useState({
      username: "",
      email: "",
      password: "",
      agreement: false,
      showAgreement: false,
      showAgreementError: false,
      errorMessage: "", // 新添加的状态
    })

    function handleChange(e) {
      const copy = { ...state }
      copy[e.target.name] = e.target.value
      setState(copy)
    }
    function handleAgreementChange(e) {
      const copy = { ...state }
      copy.agreement = !copy.agreement // 取反，将状态从选中切换到未选中或者从未选中切换到选中
      if (copy.agreement) {
        copy.showAgreementError = false; // 取消显示提示框
      }
      setState(copy)
    }

    async function handleSubmit(e) {
      e.preventDefault();
      const { username, email, password, agreement } = state;

      if (!agreement) {
        setState({ ...state, showAgreementError: true });
        setTimeout(() => {
          setState({ ...state, showAgreementError: false });
        }, 10000); // 10秒后隐藏提示框
        return;
      }
    
      // 只有同意条款被选中时才会执行以下代码
      setState({ ...state, showAgreementError: false });
      if (!username || !email || !password) {
        alert("请输入所有必填字段！");
        return;
      }
      console.log(state)
      const res = await fetch('https://pdfchat-server.azurewebsites.net/api/auth/signup',{//`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, {
        method: "POST",
        body: JSON.stringify(state),
        headers: {
          "Content-Type": "application/json"
        }
      })
      console.log(res)
      if (res.ok) {
        alert("注册成功！")
        // router.push("/signin")
        router.push("/auth/signin")
      }
    }
    return (
      <>
        {/*
          This example requires updating your template:
  
          ```
          <html class="h-full bg-white">
          <body class="h-full">
          ```
        */}
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto h-10 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt="Your Company"
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
              注册
            </h2>
          </div>
  
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" action="#" method="POST">

            <div>
                <label htmlFor="username" className="block text-sm font-medium leading-6 text-white">
                  用户名
                </label>
                <div className="mt-2">
                  <input
                    id="username"
                    name="username"
                    type="username"
                    value={state.username}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>


              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
                  邮箱
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Email" 
                    value={state.email}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
  
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
                    密码
                  </label>
                  
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="password" 
                    value={state.password}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <input
                  id="agreement"
                  name="agreement"
                  type="checkbox"
                  checked={state.agreement}
                  onChange={handleAgreementChange}
                  className="h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                />
                <label htmlFor="agreement" className="ml-2 text-sm text-white">
                  我同意
                  <a
                    href="#"
                    className="text-indigo-600 hover:text-indigo-500"
                    onClick={() => setState({ ...state, showAgreement: true })} // 添加这一行
                  >
                    条款
                  </a>
                </label>
              </div>
              <div>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  注册
                </button>
                {state.showAgreementError && (
                  <span className="text-red-500 text-sm">请点击同意条款</span>
                )}
              </div>
            </form>
            <Link href="/auth/signin" className="font-semibold text-indigo-600 hover:text-indigo-500">已有账号, 请直接登录  👉
            </Link>
            {/* <p className="mt-10 text-center text-sm text-gray-500">
              Not a member?{' '}
              <a href="#" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                Start a 14 day free trial
              </a>
            </p> */}
          </div>
        </div>
        <Modal
          isOpen={state.showAgreement}
          onRequestClose={() => setState({ ...state, showAgreement: false })}
          className="modal"
          overlayClassName="overlay"
        >
          <div style={{ color: 'black' }}>
          <h2>this is 用户协议,lol</h2>
          {/* 协议内容 */}
          </div>
        </Modal>
      </>
    )
  }