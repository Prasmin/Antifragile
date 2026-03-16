



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
    id: 3, 
    title: "Blog",
    path: "/blog",
    current: false,
  },
  {
    id: 4, 
    title: "Contact",
    path: "/contact",
    current: false,
  },
]


export default navbarItems;