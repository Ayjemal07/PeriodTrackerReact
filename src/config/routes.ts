import Home from '../pages/Home'
import PeriodTracker from '../pages/PeriodTrackerPage'
import About from '../pages/About'

import Login from '../pages/Login'

interface RouteType {
    path: string,
    component: () => JSX.Element,
    name: string
}

const routes: RouteType[] = [
    {
      path: "",
      component: Home,
      name: "Home Screen",
    },
    {
      path: "/PeriodTracker",
      component: PeriodTracker,
      name: "PeriodTracker",
    },
    {
      path: "/about",
      component: About,
      name: "About",
    },

    {
      path: "/login",
      component: Login,
      name: "Login",
    }
];

export default routes