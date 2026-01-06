



type Menu = {
  id: number;
  title: string;
  path?: string;
  newTab: boolean;
  submenu?: Menu[];
};

const navbarItems: Menu[] = [
  {
    id: 1, 
    title: "Home",
    path: "/",
    newTab: false,
  },
  {
    id: 2, 
    title: "About",
    path: "/about",
    newTab: false,
  },
  {
    id: 3, 
    title: "Blog",
    path: "/blog",
    newTab: false,
  },
  {
    id: 4, 
    title: "Pricing",
    path: "/pricing",
    newTab: false,
  },
]


export default navbarItems;