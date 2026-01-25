



type Menu = {
  id: number;
  title: string;
  path: string;
  current: boolean;
  submenu?: Menu[];
};

const navbarItems: Menu[] = [
  {
    id: 1, 
    title: "Home",
    path: "/",
    current: true,
  },
  {
    id: 2, 
    title: "About",
    path: "/about",
    current: false,
  },
  
  {
    id: 4, 
    title: "Pricing",
    path: "/pricing",
    current: false,
  },
  {
    id: 5, 
    title: "features",
    path: "/features",
    current: false,
  },
]


export default navbarItems;