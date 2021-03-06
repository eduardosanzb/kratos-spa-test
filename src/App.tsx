import React, { useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Switch, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'

const Home = () => {
    return (
        <>
            <button
                onClick={() => {
                    window.location.href =
                        'http://127.0.0.1:4455/.ory/kratos/public/self-service/browser/flows/login'
                }}
            >
                Start login
            </button>
        </>
    )
}

const Dashboard = () => {
    return <div>Dashboard</div>
}

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/auth/login">
                    <Login />
                </Route>
                <Route path="/dashboard">
                    <Dashboard />
                </Route>
                <Route path="/">
                    <>
                        <Home />
                    </>
                </Route>
            </Switch>
        </BrowserRouter>
    )
}
const Login = () => {
    const query = new URLSearchParams(useLocation().search)
    const [data, setData] = useState<any>()

    /**
     * 1. Get the requestId from the url
     * 2. GET the login request params config object from kratos public api
     * 3. Render the form and submit the
     */
    useEffect(() => {
        async function helper() {
            const r = await fetch(
                `http://127.0.0.1:4455/.ory/kratos/public/self-service/browser/flows/requests/login?request=${query.get(
                    'request'
                )}`,
                {
                    credentials: 'include',
                }
            ).then(res => res.json())
            setData(r)
        }

        helper()
    }, [query.get('request')])

    const { register, handleSubmit } = useForm()

    const onSubmit = (form: any) => {
        const searchParams = Object.keys(form)
            .map(key => {
                return encodeURIComponent(key) + '=' + encodeURIComponent(form[key])
            })
            .join('&')

        fetch(data.methods.password.config.action, {
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: searchParams,
            credentials: 'include',
        }).then(res => res.json())
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

export default App
