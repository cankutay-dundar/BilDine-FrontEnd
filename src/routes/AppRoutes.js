import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";

/* INVENTORY */
import ItemList from "../pages/inventory/ItemList";
import ItemCreate from "../pages/inventory/ItemCreate";
import ItemEdit from "../pages/inventory/ItemEdit";
import LowStockItems from "../pages/inventory/LowStockItems";
import AvailabilityRequestsList from "../pages/people/AvailabilityRequestList";

import UserOnlineOrderCreate from "../pages/user/UserOnlineOrderCreate";

/* ORDERS */
import OrderCreateDineIn from "../pages/orders/OrderCreateDineIn";
import OrderCreateOnline from "../pages/orders/OrderCreateOnline";
import OrderDetail from "../pages/orders/OrderDetail";
import ReadyOnlineOrders from "../pages/orders/ReadyOnlineOrders";
import AllOrders from "../pages/orders/AllOrders";
import UserOnlineOrderStatus from "../pages/user/UserOnlineOrderStatus";


/* COURSES */
import CourseList from "../pages/courses/CourseList";
import CourseCreate from "../pages/courses/CourseCreate";
import CourseEdit from "../pages/courses/CourseEdit";
import CourseIngredients from "../pages/courses/CourseIngredients";
import CourseAvailability from "../pages/courses/CourseAvailability";

/* USAGE */
import UsageCreate from "../pages/usage/UsageCreate";
import UsageList from "../pages/usage/UsageList";
import ItemUsageHistory from "../pages/usage/ItemUsageHistory";

/* PEOPLE */
import PeopleList from "../pages/people/PeopleList";
import AddUser from "../pages/people/AddUser";
import PromoteUser from "../pages/people/PromoteUser";
import ScheduleView from "../pages/people/ScheduleView";
import AvailabilityRequest from "../pages/people/AvailabilityRequest";
import TimeOffRequestList from "../pages/people/TimeOffRequestList";

/* AUTH & DASHBOARD */
import Login from "../auth/Login";
import ManagerDashboard from "../pages/dashboard/ManagerDashboard";


import StaffDashboard from "../pages/staff/StaffDashboard";
import StaffSchedulePage from "../pages/staff/StaffSchedulePage";
import StaffAvailabilityPage from "../pages/staff/StaffAvailabilityPage";
import StaffTimeOffPage from "../pages/staff/StaffTimeOffPage";
import StaffWorkHoursPage from "../pages/staff/StaffWorkHoursPage";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ManagerDashboard />} />

        {/* ITEMS */}
        <Route path="/items" element={<ItemList />} />
        <Route path="/items/create" element={<ItemCreate />} />
        <Route path="/items/edit/:name" element={<ItemEdit />} />
        <Route path="/items/low-stock" element={<LowStockItems />} />

        {/* COURSES */}
        <Route path="/courses" element={<CourseList />} />
        <Route path="/courses/create" element={<CourseCreate />} />
        <Route path="/courses/edit/:name" element={<CourseEdit />} />
        <Route path="/courses/:courseName/ingredients" element={<CourseIngredients />} />
        <Route path="/courses/:courseName/availability" element={<CourseAvailability />} />

        {/* USAGE */}
        <Route path="/usage/list" element={<UsageList />} />
        <Route path="/usage/create" element={<UsageCreate />} />
        <Route path="/usage/item" element={<ItemUsageHistory />} />

{/* ORDERS */}
<Route path="/orders/dine-in" element={<OrderCreateDineIn />} />
<Route path="/orders/online" element={<OrderCreateOnline />} />
<Route path="/orders/detail" element={<OrderDetail />} />
<Route path="/orders/ready-online" element={<ReadyOnlineOrders />} />
<Route path="/orders/all" element={<AllOrders />} />

{/* STAFF ROUTES (public) */}
          <Route path="/staff" element={<StaffDashboard />} />
          <Route path="/staff/schedule" element={<StaffSchedulePage />} />
          <Route path="/staff/availability" element={<StaffAvailabilityPage />} />
          <Route path="/staff/timeoff" element={<StaffTimeOffPage />} />
          <Route path="/staff/work-hours" element={<StaffWorkHoursPage />} />
          <Route path="/user/online" element={<UserOnlineOrderCreate />} />
          <Route path="/user/order/:id" element={<UserOnlineOrderStatus />} />


          {/* PEOPLE */}
        <Route path="/people" element={<PeopleList />} />
        <Route path="/people/add" element={<AddUser />} />
        <Route path="/people/promote" element={<PromoteUser />} />
        <Route path="/schedule" element={<ScheduleView />} />
        <Route path="/people/availability" element={<AvailabilityRequest />} />
        <Route path="/people/availability/requests" element={<AvailabilityRequestsList />}/>
        <Route path="/people/timeoff/requests" element={<TimeOffRequestList />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
