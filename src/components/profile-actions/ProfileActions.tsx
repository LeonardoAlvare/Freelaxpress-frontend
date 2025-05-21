import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/auth/auth.store";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Ripple } from "primereact/ripple";

export default function ProfileActions() {
  const user = useAuthStore((state) => state.userLogged);
  const logout = useAuthStore((state) => state.logout);
  const fullname = `${user?.name || ""}${
    user?.lastname ? ` ${user.lastname}` : ""
  }`.trim();
  const menuLeft = useRef<Menu>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
    window.location.reload();
  };

  const baseMenuItems: MenuItem[] = [
    {
      label: "Perfil",
      icon: "pi pi-user",
      command: () => navigate(`/profile`),
      className: "hover:bg-blue-100 text-gray-800",
    },
  ];

  if (user?.isFreelancer) {
    baseMenuItems.push({
      label: "Mis postulaciones",
      icon: "pi pi-list",
      command: () => navigate(`/proposal/${user?._id}`),
      className: "hover:bg-blue-100 text-gray-800",
    });
  }

  const menuItems: MenuItem[] = [
    ...baseMenuItems,
    {
      separator: true,
      className: "border-t border-gray-200 my-1",
    },
    {
      label: "Cerrar sesión",
      icon: "pi pi-sign-out",
      command: handleLogout, // Usa la nueva función
      className: "hover:bg-red-100 text-red-600",
    },
  ];

  return (
    <Button
      text
      className="flex items-center gap-2 cursor-pointer"
      onClick={(event) => menuLeft?.current?.toggle(event)}
      aria-controls="popup_menu_left"
      aria-haspopup
    >
      <Avatar
        image={`https://ui-avatars.com/api/?name=${fullname}&format=svg&background=random&bold=true`}
        size="large"
        shape="circle"
        className="border-2 border-white shadow"
      />

      <span className="font-bold text-bluegray-50">{fullname}</span>
      <i className="pi pi-chevron-down text-gray-500"></i>
      <Ripple />
      <Menu
        model={menuItems}
        popup
        ref={menuLeft}
        id="popup_menu_left"
        className="shadow-xl border border-gray-200 rounded-lg w-56"
        popupAlignment="right"
      />
    </Button>
  );
}
