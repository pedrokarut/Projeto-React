import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Login } from '@/presentation/pages/login'
import '@/presentation/styles/global.scss'
import { Signup } from '@/presentation/pages/login/signup/signup'
type Props = {
  makeLogin: React.FC
}

const Router: React.FC<Props> = ({ makeLogin }: Props) => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" exact component={Login}></Route>
        <Route path="/signup" exact component={Signup}></Route>
      </Switch>
    </BrowserRouter>
  )
}

export default Router
