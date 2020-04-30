import React, { useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Switch, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'

const api = (url: string, args?: RequestInit) =>
    fetch(url, { credentials: 'include', ...args }).then(res => res.json())

const Login = () => {
    const query = new URLSearchParams(useLocation().search)
    const [data, setData] = useState<any>()

    useEffect(() => {
        async function helper() {
            const r = await api(
                `http://127.0.0.1:4455/.ory/kratos/public/self-service/browser/flows/requests/login?request=${query.get(
                    'request'
                )}`
            )
            setData(r)
        }

        helper()
    }, [query.get('request')])
    const { register, handleSubmit, watch, errors } = useForm()

    const onSubmit = (form: any) => {
        api(data.methods.password.config.action, {
            method: 'post',
            body: JSON.stringify(form),
        })
    }

    return (
        <div>
            <pre>{JSON.stringify(query.get('request'), null, 2)}</pre>
            <pre>{JSON.stringify(data, null, 2)}</pre>
            login
            <form onSubmit={handleSubmit(onSubmit)}>
                {data &&
                    data?.methods.password.config.fields.map(
                        (
                            field: JSX.IntrinsicAttributes &
                                React.ClassAttributes<HTMLInputElement> &
                                React.InputHTMLAttributes<HTMLInputElement>
                        ) => (
                            <label>
                                {field.name}
                                <input {...field} ref={register} />
                            </label>
                        )
                    )}
                <input type="submit" value="Submit" />
            </form>
        </div>
    )
}
const Home = () => {
    return <div>Home</div>
}

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/auth/login">
                    <Login />
                </Route>
                <Route path="/dashboard">
                    <Home />
                </Route>
                <Route path="/">
                    <Home />
                </Route>
            </Switch>
        </BrowserRouter>
    )
}

export default App
