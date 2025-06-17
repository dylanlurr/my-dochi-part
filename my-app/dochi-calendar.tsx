"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  CalendarIcon,
  CheckSquare,
  Focus,
  User,
  Trash2,
  Settings,
  HelpCircle,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react"
import { useState, useEffect } from "react"

export default function DochiCalendar() {
  const [activeSection, setActiveSection] = useState("Calendar")
  const [selectedDate, setSelectedDate] = useState<number>(13)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(5) // June = 5 (0-indexed)
  const [currentYear, setCurrentYear] = useState(2025)
  const [viewMode, setViewMode] = useState<"Month" | "Week">("Month")

  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024)

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      // Auto-close mobile menu on desktop
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false)
      }
      // Auto-collapse sidebar on tablet
      if (window.innerWidth < 1024 && window.innerWidth >= 768) {
        setSidebarCollapsed(true)
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const daysOfWeekShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  // Generate calendar days for current month
  const getDaysInMonth = (month: number, year: number) => {
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const daysInPrevMonth = new Date(year, month, 0).getDate()

    const days = []

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        isPrevMonth: true,
        isNextMonth: false,
      })
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        isPrevMonth: false,
        isNextMonth: false,
      })
    }

    // Next month days to fill the grid
    const remainingCells = 42 - days.length
    for (let day = 1; day <= remainingCells; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        isPrevMonth: false,
        isNextMonth: true,
      })
    }

    return days
  }

  const calendarDays = getDaysInMonth(currentMonth, currentYear)
  const miniCalendarDays = getDaysInMonth(currentMonth, currentYear)

  const handleDateClick = (day: number, isCurrentMonth: boolean, isPrevMonth: boolean, isNextMonth: boolean) => {
    if (isCurrentMonth) {
      setSelectedDate(selectedDate === day ? 0 : day)
    } else if (isPrevMonth) {
      // Navigate to previous month and select the date
      if (currentMonth === 0) {
        setCurrentMonth(11)
        setCurrentYear(currentYear - 1)
      } else {
        setCurrentMonth(currentMonth - 1)
      }
      setSelectedDate(day)
    } else if (isNextMonth) {
      // Navigate to next month and select the date
      if (currentMonth === 11) {
        setCurrentMonth(0)
        setCurrentYear(currentYear + 1)
      } else {
        setCurrentMonth(currentMonth + 1)
      }
      setSelectedDate(day)
    }
  }

  const navigateMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (currentMonth === 0) {
        setCurrentMonth(11)
        setCurrentYear(currentYear - 1)
      } else {
        setCurrentMonth(currentMonth - 1)
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0)
        setCurrentYear(currentYear + 1)
      } else {
        setCurrentMonth(currentMonth + 1)
      }
    }
  }

  const getCurrentWeekDays = () => {
    const today = new Date(currentYear, currentMonth, selectedDate || 13)
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())

    const weekDays = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      weekDays.push(day)
    }
    return weekDays
  }

  const appointments = [
    {
      id: 1,
      time: "9:00",
      title: "Team Meeting",
      duration: "9:00 AM - 10:00 AM",
      color: "bg-emerald-500",
      category: "personal",
    },
    {
      id: 2,
      time: "10:30",
      title: "Client Call",
      duration: "10:30 AM - 11:30 AM",
      color: "bg-purple-500",
      category: "work",
    },
    {
      id: 3,
      time: "16:00",
      title: "Design Review",
      duration: "4:00 PM - 5:00 PM",
      color: "bg-emerald-500",
      category: "personal",
    },
    {
      id: 4,
      time: "18:00",
      title: "Project Sync",
      duration: "6:00 PM - 7:00 PM",
      color: "bg-purple-500",
      category: "work",
    },
    {
      id: 5,
      time: "19:30",
      title: "Urgent Review",
      duration: "7:30 PM - 8:30 PM",
      color: "bg-red-500",
      category: "urgent",
    },
    {
      id: 6,
      time: "20:00",
      title: "Dinner Meeting",
      duration: "8:00 PM - 9:00 PM",
      color: "bg-blue-500",
      category: "personal",
    },
    {
      id: 7,
      time: "21:00",
      title: "Code Review",
      duration: "9:00 PM - 10:00 PM",
      color: "bg-purple-500",
      category: "work",
    },
  ]

  const getAppointmentHoverColor = (category: string) => {
    switch (category) {
      case "work":
        return "hover:bg-purple-50 hover:border-purple-200"
      case "urgent":
        return "hover:bg-red-50 hover:border-red-200"
      case "personal":
        return "hover:bg-emerald-50 hover:border-emerald-200"
      default:
        return "hover:bg-blue-50 hover:border-blue-200"
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Left Sidebar */}
      <div
        className={`
          ${
            windowWidth < 1024
              ? `fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out ${
                  mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                }`
              : `${sidebarCollapsed ? "w-20" : "w-72"} transition-all duration-500 ease-in-out`
          }
          bg-white border-r border-gray-200 flex flex-col shadow-xl h-screen relative overflow-hidden
        `}
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-gray-50/30 pointer-events-none"></div>

        {/* Logo */}
        <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-100 flex-shrink-0 h-16 sm:h-[88px] flex items-center relative z-10">
          <div className="flex items-center justify-between w-full">
            <div
              className={`transition-all duration-500 ease-in-out ${
                sidebarCollapsed && windowWidth >= 1024
                  ? "opacity-0 scale-95 -translate-x-4"
                  : "opacity-100 scale-100 translate-x-0"
              }`}
            >
              {(!sidebarCollapsed || windowWidth < 1024) && (
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full"></div>
                  </div>
                  <span className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">Dochi.</span>
                </div>
              )}
            </div>

            <div
              className={`${
                sidebarCollapsed && windowWidth >= 1024 ? "mx-auto" : ""
              } w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-all duration-300 ease-in-out rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm`}
              onClick={() => {
                if (windowWidth < 1024) {
                  setMobileMenuOpen(!mobileMenuOpen)
                } else {
                  setSidebarCollapsed(!sidebarCollapsed)
                }
              }}
            >
              {windowWidth < 1024 && mobileMenuOpen ? (
                <X className="w-4 h-4 text-gray-600" />
              ) : (
                <Menu className="w-4 h-4 text-gray-600" />
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div
          className={`${sidebarCollapsed && windowWidth >= 1024 ? "px-3" : "px-4 sm:px-6"} py-4 sm:py-6 flex-1 relative z-10`}
        >
          <div className="space-y-1">
            <div
              className={`transition-all duration-500 ease-in-out ${
                sidebarCollapsed && windowWidth >= 1024
                  ? "opacity-0 scale-95 -translate-x-4"
                  : "opacity-100 scale-100 translate-x-0"
              }`}
            >
              {(!sidebarCollapsed || windowWidth < 1024) && (
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 sm:mb-6 px-3">
                  MAIN
                </div>
              )}
            </div>

            {[
              { key: "To-Do", icon: CheckSquare, label: "To-Do" },
              { key: "Calendar", icon: CalendarIcon, label: "Calendar" },
              { key: "Focus", icon: Focus, label: "Focus" },
              { key: "Dochi", icon: User, label: "Dochi" },
              { key: "Bin", icon: Trash2, label: "Bin" },
            ].map(({ key, icon: Icon, label }) => (
              <div
                key={key}
                className={`flex items-center ${
                  sidebarCollapsed && windowWidth >= 1024 ? "justify-center" : "space-x-3"
                } px-3 py-3 sm:py-3 rounded-xl cursor-pointer transition-all duration-200 ease-in-out ${
                  activeSection === key
                    ? "bg-[#FFD4F2] text-purple-700 shadow-sm"
                    : "text-gray-700 hover:bg-gray-50 hover:shadow-sm"
                }`}
                onClick={() => {
                  setActiveSection(key)
                  if (windowWidth < 1024) setMobileMenuOpen(false)
                }}
                title={sidebarCollapsed && windowWidth >= 1024 ? label : ""}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <div
                  className={`transition-all duration-500 ease-in-out ${
                    sidebarCollapsed && windowWidth >= 1024
                      ? "opacity-0 scale-95 translate-x-4"
                      : "opacity-100 scale-100 translate-x-0"
                  }`}
                >
                  {(!sidebarCollapsed || windowWidth < 1024) && <span className="text-sm font-medium">{label}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="border-t border-gray-100 bg-gradient-to-b from-gray-50/50 to-gray-100/30 relative z-10">
          <div className={`${sidebarCollapsed && windowWidth >= 1024 ? "px-3 py-4" : "px-4 sm:px-6 py-4"} space-y-1`}>
            {[
              { key: "Settings", icon: Settings, label: "Settings" },
              { key: "Support", icon: HelpCircle, label: "Support" },
            ].map(({ key, icon: Icon, label }) => (
              <div
                key={key}
                className={`flex items-center ${
                  sidebarCollapsed && windowWidth >= 1024 ? "justify-center" : "space-x-3"
                } px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-xl cursor-pointer transition-all duration-200 ease-in-out hover:shadow-sm ${
                  activeSection === key ? "bg-[#FFD4F2] text-purple-700 shadow-sm" : ""
                }`}
                onClick={() => {
                  setActiveSection(key)
                  if (windowWidth < 1024) setMobileMenuOpen(false)
                }}
                title={sidebarCollapsed && windowWidth >= 1024 ? label : ""}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <div
                  className={`transition-all duration-500 ease-in-out ${
                    sidebarCollapsed && windowWidth >= 1024
                      ? "opacity-0 scale-95 translate-x-4"
                      : "opacity-100 scale-100 translate-x-0"
                  }`}
                >
                  {(!sidebarCollapsed || windowWidth < 1024) && <span className="text-sm font-medium">{label}</span>}
                </div>
              </div>
            ))}

            <div
              className={`flex items-center ${
                sidebarCollapsed && windowWidth >= 1024 ? "justify-center" : "justify-between"
              } px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-xl cursor-pointer transition-all duration-200 ease-in-out hover:shadow-sm ${
                activeSection === "Profile" ? "bg-[#FFD4F2] text-purple-700 shadow-sm" : ""
              }`}
              onClick={() => {
                setActiveSection("Profile")
                if (windowWidth < 1024) setMobileMenuOpen(false)
              }}
              title={sidebarCollapsed && windowWidth >= 1024 ? "Profile" : ""}
            >
              <div className={`flex items-center ${sidebarCollapsed && windowWidth >= 1024 ? "" : "space-x-3"}`}>
                <div className="w-6 h-6 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full shadow-sm flex-shrink-0"></div>
                <div
                  className={`transition-all duration-500 ease-in-out ${
                    sidebarCollapsed && windowWidth >= 1024
                      ? "opacity-0 scale-95 translate-x-4"
                      : "opacity-100 scale-100 translate-x-0"
                  }`}
                >
                  {(!sidebarCollapsed || windowWidth < 1024) && <span className="text-sm font-medium">username</span>}
                </div>
              </div>
              <div
                className={`transition-all duration-500 ease-in-out ${
                  sidebarCollapsed && windowWidth >= 1024
                    ? "opacity-0 scale-95 translate-x-4"
                    : "opacity-100 scale-100 translate-x-0"
                }`}
              >
                {(!sidebarCollapsed || windowWidth < 1024) && (
                  <MoreHorizontal className="w-4 h-4 flex-shrink-0 text-gray-400" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 shadow-sm h-16 sm:h-[88px] flex items-center">
          <div className="flex items-center space-x-4">
            {windowWidth < 1024 && (
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Calendar</h1>
          </div>
        </div>

        {/* Calendar Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 pb-8 sm:pb-12 lg:pb-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-auto">
          <div className="flex flex-col lg:flex-row lg:space-x-8 space-y-6 lg:space-y-0 h-full max-w-full mb-6 sm:mb-8 lg:mb-12">
            {/* Left Panel */}
            <div className="w-full lg:w-80 space-y-4 sm:space-y-6 flex-shrink-0">
              {/* Mini Calendar */}
              <Card className="bg-white/95 backdrop-blur-sm shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
                <CardHeader className="pb-3 px-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => navigateMonth("prev")}
                      className="p-2 hover:bg-purple-50 rounded-lg transition-all duration-200 hover:shadow-sm"
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-600" />
                    </button>
                    <CardTitle className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
                      {monthNames[currentMonth]} {currentYear}
                    </CardTitle>
                    <button
                      onClick={() => navigateMonth("next")}
                      className="p-2 hover:bg-purple-50 rounded-lg transition-all duration-200 hover:shadow-sm"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 px-4 sm:px-6">
                  <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 text-center font-medium">
                    {daysOfWeekShort.map((day) => (
                      <div key={day} className="py-2">
                        {day.charAt(0)}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {miniCalendarDays.slice(0, 42).map((dayObj, index) => (
                      <div
                        key={index}
                        className="h-8 sm:h-9 flex items-center justify-center text-sm cursor-pointer"
                        onClick={() =>
                          handleDateClick(dayObj.day, dayObj.isCurrentMonth, dayObj.isPrevMonth, dayObj.isNextMonth)
                        }
                      >
                        <div
                          className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg transition-all duration-200 ${
                            selectedDate === dayObj.day && dayObj.isCurrentMonth
                              ? "bg-gradient-to-br from-pink-400 to-purple-500 text-white font-bold shadow-lg"
                              : dayObj.isCurrentMonth
                                ? "text-gray-700 hover:bg-purple-50 hover:shadow-sm"
                                : "text-gray-400 hover:bg-gray-50"
                          }`}
                        >
                          {dayObj.day}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Today's Events - Now with Scrollable Container */}
              <Card className="bg-white/95 backdrop-blur-sm shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
                <CardHeader className="pb-3 px-4 sm:px-6">
                  <CardTitle className="text-base sm:text-lg font-bold flex items-center space-x-2 text-gray-900">
                    <CalendarIcon className="w-5 h-5 text-blue-600" />
                    <span>{"Today's Events"}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 pb-4">
                  {/* Scrollable Events Container */}
                  <div className="max-h-80 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {appointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className={`flex items-center space-x-3 p-3 sm:p-4 rounded-xl ${getAppointmentHoverColor(appointment.category)} hover:shadow-lg transition-all duration-300 cursor-pointer group border border-transparent hover:border-gray-200`}
                      >
                        <div
                          className={`w-1 h-10 sm:h-12 ${appointment.color} rounded-full shadow-sm flex-shrink-0`}
                        ></div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm group-hover:text-gray-900 transition-colors text-gray-800">
                            {appointment.time}
                          </div>
                          <div className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors font-medium truncate">
                            {appointment.title}
                          </div>
                          <div className="text-xs text-gray-400 group-hover:text-gray-600 transition-colors">
                            {appointment.duration}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Panel - Main Calendar */}
            <div className="flex-1 min-w-0 max-w-full">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col">
                {/* Calendar Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 border-b border-gray-200 space-y-4 sm:space-y-0 flex-shrink-0">
                  <div className="flex items-center space-x-1 bg-gray-100 rounded-full p-1 shadow-inner">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode("Month")}
                      className={`rounded-full px-4 sm:px-6 py-2 text-sm font-bold transition-all duration-300 ease-in-out ${
                        viewMode === "Month"
                          ? "bg-white shadow-lg text-gray-900"
                          : "text-gray-600 hover:bg-white hover:shadow-md"
                      }`}
                    >
                      Month
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode("Week")}
                      className={`rounded-full px-4 sm:px-6 py-2 text-sm font-bold transition-all duration-300 ease-in-out ${
                        viewMode === "Week"
                          ? "bg-white shadow-lg text-gray-900"
                          : "text-gray-600 hover:bg-white hover:shadow-md"
                      }`}
                    >
                      Week
                    </Button>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight text-center sm:text-right">
                    {monthNames[currentMonth]} {currentYear}
                  </div>
                </div>

                {/* Calendar Grid Container */}
                <div className="flex-1 p-4 sm:p-6 overflow-hidden">
                  {viewMode === "Month" ? (
                    /* Month View */
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 h-full flex flex-col overflow-hidden">
                      {/* Days of Week Header */}
                      <div className="grid grid-cols-7 border-b border-gray-200 flex-shrink-0">
                        {daysOfWeek.map((day, index) => (
                          <div
                            key={day}
                            className="bg-gradient-to-r from-pink-100 to-purple-100 p-2 sm:p-4 text-center border-r border-gray-200 last:border-r-0"
                          >
                            <div className="font-bold text-gray-800 text-xs sm:text-sm">
                              {windowWidth < 640
                                ? daysOfWeekShort[index].charAt(0)
                                : windowWidth < 1024
                                  ? daysOfWeekShort[index]
                                  : day}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Calendar Days Grid */}
                      <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
                        <div className="h-full">
                          {Array.from({ length: 6 }, (_, weekIndex) => (
                            <div
                              key={weekIndex}
                              className="grid grid-cols-7 h-1/6 border-b border-gray-100 last:border-b-0"
                            >
                              {calendarDays.slice(weekIndex * 7, (weekIndex + 1) * 7).map((dayObj, dayIndex) => (
                                <div
                                  key={`${weekIndex}-${dayIndex}`}
                                  className="border-r border-gray-100 last:border-r-0 cursor-pointer hover:bg-purple-50 transition-all duration-200 bg-white/80 hover:shadow-sm p-2 sm:p-3"
                                  onClick={() =>
                                    handleDateClick(
                                      dayObj.day,
                                      dayObj.isCurrentMonth,
                                      dayObj.isPrevMonth,
                                      dayObj.isNextMonth,
                                    )
                                  }
                                >
                                  <div
                                    className={`text-sm font-bold ${!dayObj.isCurrentMonth ? "text-gray-400" : "text-gray-800"}`}
                                  >
                                    {selectedDate === dayObj.day && dayObj.isCurrentMonth ? (
                                      <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg">
                                        {dayObj.day}
                                      </div>
                                    ) : (
                                      dayObj.day
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Week View - Outlook Style */
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 h-full flex flex-col overflow-hidden">
                      {/* Week Header */}
                      <div className="grid grid-cols-8 border-b border-gray-200 flex-shrink-0">
                        <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-2 sm:p-4 border-r border-gray-200">
                          <div className="text-xs sm:text-sm font-bold text-purple-800">Time</div>
                        </div>
                        {getCurrentWeekDays().map((date, index) => (
                          <div
                            key={index}
                            className="bg-gradient-to-r from-pink-100 to-purple-100 p-2 sm:p-4 text-center border-r border-gray-200 last:border-r-0"
                          >
                            <div className="text-xs text-gray-600 font-medium">
                              {windowWidth < 640 ? daysOfWeekShort[index].charAt(0) : daysOfWeekShort[index]}
                            </div>
                            <div
                              className={`text-sm sm:text-lg font-bold ${date.getDate() === selectedDate ? "text-purple-600" : "text-gray-800"}`}
                            >
                              {date.getDate()}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Time Slots */}
                      <div className="flex-1 overflow-y-auto">
                        {Array.from({ length: 24 }, (_, hour) => (
                          <div key={hour} className="grid grid-cols-8 border-b border-gray-100 last:border-b-0">
                            <div className="p-2 sm:p-3 border-r border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
                              <div className="text-xs text-purple-700 font-medium">
                                {hour === 0
                                  ? "12 AM"
                                  : hour < 12
                                    ? `${hour} AM`
                                    : hour === 12
                                      ? "12 PM"
                                      : `${hour - 12} PM`}
                              </div>
                            </div>
                            {getCurrentWeekDays().map((_, dayIndex) => (
                              <div
                                key={dayIndex}
                                className="h-10 sm:h-12 border-r border-gray-100 last:border-r-0 hover:bg-purple-50 cursor-pointer transition-all duration-200 relative"
                              >
                                {/* Sample events */}
                                {hour === 9 && dayIndex === 4 && (
                                  <div className="absolute inset-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs p-1 rounded-lg shadow-md font-medium">
                                    Meeting
                                  </div>
                                )}
                                {hour === 14 && dayIndex === 2 && (
                                  <div className="absolute inset-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs p-1 rounded-lg shadow-md font-medium">
                                    Call
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
