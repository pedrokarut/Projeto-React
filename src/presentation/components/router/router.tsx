import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Login } from '@/presentation/pages/login'
import '@/presentation/styles/global.scss'
const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" exact component={Login}></Route>
      </Switch>
    </BrowserRouter>
  )
}

export default Router
