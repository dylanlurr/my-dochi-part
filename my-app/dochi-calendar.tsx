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
  ClipboardList,
} from "lucide-react"
import { useState, useEffect } from "react"

// A simple component to display for different pages
function PageContent({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center h-full">
      <h1 className="text-2xl font-bold text-gray-500">{`This is the ${title} page`}</h1>
    </div>
  )
}

export default function DochiCalendar() {
  const [activeSection, setActiveSection] = useState("Calendar")
  const [selectedDate, setSelectedDate] = useState<number>(13)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(5) // June = 5 (0-indexed)
  const [currentYear, setCurrentYear] = useState(2025)
  const [viewMode, setViewMode] = useState<"Month" | "Week">("Month")
  
  const [currentPage, setCurrentPage] = useState("Calendar")

  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024)

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false)
      }
      if (window.innerWidth < 1024 && window.innerWidth >= 768) {
        setSidebarCollapsed(true)
      } else if (window.innerWidth >= 1024) {
        setSidebarCollapsed(false)
      }
    }
    window.addEventListener("resize", handleResize)
    handleResize(); // Call on initial mount
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const daysOfWeekShort = ["S", "M", "T", "W", "T", "F", "S"]
  const monthNames = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December",
  ]

  const getDaysInMonth = (month: number, year: number) => {
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const daysInPrevMonth = new Date(year, month, 0).getDate()
    const days = []
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: daysInPrevMonth - i, isCurrentMonth: false, isPrevMonth: true, isNextMonth: false })
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ day, isCurrentMonth: true, isPrevMonth: false, isNextMonth: false })
    }
    const remainingCells = 42 - days.length
    for (let day = 1; day <= remainingCells; day++) {
      days.push({ day, isCurrentMonth: false, isPrevMonth: false, isNextMonth: true })
    }
    return days
  }

  const calendarDays = getDaysInMonth(currentMonth, currentYear)
  const miniCalendarDays = getDaysInMonth(currentMonth, currentYear)

  const handleDateClick = (day: number, isCurrentMonth: boolean, isPrevMonth: boolean, isNextMonth: boolean) => {
    if (isCurrentMonth) {
      setSelectedDate(selectedDate === day ? 0 : day)
    } else if (isPrevMonth) {
      if (currentMonth === 0) {
        setCurrentMonth(11)
        setCurrentYear(currentYear - 1)
      } else {
        setCurrentMonth(currentMonth - 1)
      }
      setSelectedDate(day)
    } else if (isNextMonth) {
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
    { id: 1, title: "Appointment 1", startTime: "9.00 A.M.", endTime: "9.30 A.M.", color: "bg-teal-400", hoverColor: "hover:bg-teal-100" },
    { id: 2, title: "Appointment 2", startTime: "10.30 A.M.", endTime: "13.00 P.M.", color: "bg-purple-400", hoverColor: "hover:bg-purple-100" },
    { id: 3, title: "Appointment 3", startTime: "16.00 P.M.", endTime: "17.30 P.M.", color: "bg-gray-400", hoverColor: "hover:bg-gray-100" },
    { id: 4, title: "Appointment 4", startTime: "18.00 P.M.", endTime: "19.00 P.M.", color: "bg-pink-400", hoverColor: "hover:bg-pink-100" },
    { id: 5, title: "Appointment 5", startTime: "20.00 P.M.", endTime: "21.00 P.M.", color: "bg-blue-400", hoverColor: "hover:bg-blue-100" },
    { id: 6, title: "Appointment 6", startTime: "22.00 P.M.", endTime: "22.30 P.M.", color: "bg-green-400", hoverColor: "hover:bg-green-100" },
  ]
  
  const handleNavClick = (page: string) => {
    setActiveSection(page);
    setCurrentPage(page);
    if (windowWidth < 1024) setMobileMenuOpen(false);
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans">
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}
      <div
        className={`
          ${windowWidth < 1024
              ? `fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${
                  mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                }`
              : `${sidebarCollapsed ? "w-20" : "w-64"} transition-all duration-300`
          } bg-white border-r border-gray-200 flex flex-col h-screen
        `}
      >
        <div className={`flex items-center h-16 px-4 border-b border-gray-200 flex-shrink-0 ${sidebarCollapsed && windowWidth >= 1024 ? 'justify-center' : 'justify-between'}`}>
          <div
            className={`flex items-center space-x-2 transition-opacity duration-200 ease-in-out overflow-hidden ${
              sidebarCollapsed && windowWidth >= 1024 ? "opacity-0 w-0" : "opacity-100 w-auto"
            }`}
          >
            <div className="w-6 h-6 bg-gray-800 rounded-md flex-shrink-0"></div>
            <span className="text-lg font-bold text-gray-800 whitespace-nowrap">Dochi.</span>
          </div>
          <button
            onClick={() => {
              if (windowWidth < 1024) {
                setMobileMenuOpen(!mobileMenuOpen);
              } else {
                setSidebarCollapsed(!sidebarCollapsed);
              }
            }}
            className="p-3 rounded-md hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
          </button>
        </div>

        <div className={`flex-1 px-4 py-6 space-y-2`}>
          {(!sidebarCollapsed || windowWidth < 1024) && (
            <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">MAIN</h3>
          )}
          {[
            { key: "To-Do", icon: CheckSquare, label: "To-Do" },
            { key: "Calendar", icon: CalendarIcon, label: "Calendar" },
            { key: "Focus", icon: Focus, label: "Focus" },
            { key: "Dochi", icon: User, label: "Dochi" },
            { key: "Bin", icon: Trash2, label: "Bin" },
          ].map(({ key, icon: Icon, label }) => (
            <div
              key={key}
              className={`flex items-center rounded-lg cursor-pointer transition-colors duration-200
                ${sidebarCollapsed && windowWidth >= 1024 ? "justify-center h-10 w-10 mx-auto" : "space-x-3 h-10 px-4"}
                ${activeSection === key ? "bg-[#FFD4F2] text-purple-700" : "text-gray-600 hover:bg-gray-100"}`}
              onClick={() => handleNavClick(key)}
              title={sidebarCollapsed && windowWidth >= 1024 ? label : ""}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {(!sidebarCollapsed || windowWidth < 1024) && <span className="text-sm font-medium">{label}</span>}
            </div>
          ))}
        </div>

        <div className="px-4 py-4 border-t border-gray-200">
          <div className="space-y-2">
            {[
              { key: "Settings", icon: Settings, label: "Settings" },
              { key: "Support", icon: HelpCircle, label: "Support" },
            ].map(({ key, icon: Icon, label }) => (
              <div
                key={key}
                className={`flex items-center rounded-lg cursor-pointer transition-colors duration-200
                  ${sidebarCollapsed && windowWidth >= 1024 ? "justify-center h-10 w-10 mx-auto" : "space-x-3 h-10 px-4"}
                  ${activeSection === key ? "bg-[#FFD4F2] text-purple-700" : "text-gray-600 hover:bg-gray-100"}`}
                onClick={() => handleNavClick(key)}
                title={sidebarCollapsed && windowWidth >= 1024 ? label : ""}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {(!sidebarCollapsed || windowWidth < 1024) && <span className="text-sm font-medium">{label}</span>}
              </div>
            ))}
            <div
              className={`flex items-center rounded-lg cursor-pointer transition-colors duration-200
                ${sidebarCollapsed && windowWidth >= 1024 ? "justify-center h-10 w-10 mx-auto" : "h-10 px-4"}
                ${activeSection === 'Profile' ? "bg-[#FFD4F2] text-purple-700" : "text-gray-600 hover:bg-gray-100"}`}
              onClick={() => handleNavClick("Profile")}
              title={sidebarCollapsed && windowWidth >= 1024 ? "Profile" : ""}
            >
              <div className={`flex items-center w-full ${sidebarCollapsed && windowWidth >= 1024 ? "justify-center" : "justify-between"}`}>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-[#FFD4F2] rounded-full flex-shrink-0"></div>
                  {(!sidebarCollapsed || windowWidth < 1024) && <span className="text-sm font-medium">username</span>}
                </div>
                {(!sidebarCollapsed || windowWidth < 1024) && <MoreHorizontal className="w-4 h-4 text-gray-400" />}
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-8 py-4 h-16 flex items-center flex-shrink-0">
          <h1 className="text-xl font-bold text-gray-800">{currentPage}</h1>
        </header>

        <div 
          className="flex-1 overflow-auto p-8"
          style={{ background: 'linear-gradient(to bottom right, rgba(223, 240, 255, 0.8), rgba(255, 212, 242, 0.8))'}}
        >
          {currentPage === "Calendar" ? (
            <div className="flex flex-col lg:flex-row lg:space-x-8 h-full">
              <div className="w-full lg:w-72 flex flex-col space-y-6 flex-shrink-0 mb-8 lg:mb-0">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <button onClick={() => navigateMonth("prev")} className="p-1 rounded hover:bg-gray-100">
                      <ChevronLeft className="w-5 h-5 text-gray-500" />
                    </button>
                    <h3 className="text-sm font-semibold text-gray-700">{monthNames[currentMonth]} {currentYear}</h3>
                    <button onClick={() => navigateMonth("next")} className="p-1 rounded hover:bg-gray-100">
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-y-2 text-xs text-center text-gray-400 font-medium">
                    {daysOfWeekShort.map((day) => <div key={day}>{day}</div>)}
                  </div>
                  <div className="grid grid-cols-7 gap-y-1 mt-2">
                    {miniCalendarDays.slice(0, 42).map((dayObj, index) => (
                      <div
                        key={index}
                        className="h-8 flex items-center justify-center text-xs cursor-pointer"
                        onClick={() => handleDateClick(dayObj.day, dayObj.isCurrentMonth, dayObj.isPrevMonth, dayObj.isNextMonth)}
                      >
                        <div
                          className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors duration-200
                            ${selectedDate === dayObj.day && dayObj.isCurrentMonth
                              ? "bg-[#FFD4F2] text-purple-700 font-semibold"
                              : dayObj.isCurrentMonth ? "text-gray-600 hover:bg-gray-100" : "text-gray-300"
                            }`}
                        >
                          {dayObj.day}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 flex-1 flex flex-col min-h-0">
                <CardHeader className="p-4 border-b border-gray-200 flex justify-center items-center">
                    <CardTitle className="text-sm font-semibold flex items-center text-gray-700">
                      <ClipboardList className="w-4 h-4 mr-2" />
                      Today's Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4 flex-1 overflow-y-auto">
                    <div className="relative">
                      <div className="space-y-4">
                        {appointments.map((appointment) => (
                           <div key={appointment.id} className={`flex items-start p-2 rounded-lg cursor-pointer transition-colors duration-200 ${appointment.hoverColor}`}>
                             <div className="relative w-full">
                               <div className="absolute top-2 -left-px w-2.5 h-2.5 rounded-full border-2 border-white" style={{ backgroundColor: `var(--color-background)` }}>
                                 <div className={`w-full h-full rounded-full ${appointment.color}`}></div>
                               </div>
                               <div className="pl-6">
                                 <p className="text-sm font-semibold text-gray-800">{appointment.title}</p>
                                 <p className="text-xs text-gray-400">{appointment.startTime} – {appointment.endTime}</p>
                               </div>
                             </div>
                           </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
                  <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
                    <div className="flex items-center space-x-1 bg-gray-100 rounded-full p-1">
                      <Button
                        variant='ghost'
                        size="sm"
                        onClick={() => setViewMode("Month")}
                        className={`rounded-full px-4 py-1 text-xs font-semibold transition-none ${viewMode === 'Month' ? 'bg-white text-gray-800' : 'text-gray-500 hover:bg-gray-200'}`}
                      >
                        Month
                      </Button>
                      <Button
                        variant='ghost'
                        size="sm"
                        onClick={() => setViewMode("Week")}
                        className={`rounded-full px-4 py-1 text-xs font-semibold transition-none ${viewMode === 'Week' ? 'bg-white text-gray-800' : 'text-gray-500 hover:bg-gray-200'}`}
                      >
                        Week
                      </Button>
                    </div>
                    <div className="text-lg font-semibold text-gray-800 mr-4">{currentYear}</div>
                  </div>

                  {viewMode === "Month" ? (
                    <div className="flex-1 grid grid-cols-7" style={{ gridTemplateRows: 'auto repeat(6, 1fr)' }}>
                      {daysOfWeek.map((day) => (
                        <div key={day} className="p-4 text-center border-b border-r border-gray-200">
                          <p className="font-semibold text-gray-600 text-sm">{day}</p>
                        </div>
                      ))}
                      {calendarDays.map((dayObj, index) => (
                        <div
                          key={index}
                          className="p-2 border-b border-r border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleDateClick(dayObj.day, dayObj.isCurrentMonth, dayObj.isPrevMonth, dayObj.isNextMonth)}
                        >
                          <div className="flex justify-start items-start h-full">
                            <p className={`w-7 h-7 flex items-center justify-center text-sm font-medium rounded-full
                               ${selectedDate === dayObj.day && dayObj.isCurrentMonth
                                  ? "bg-[#FFD4F2] text-purple-700"
                                  : dayObj.isCurrentMonth ? "text-gray-700" : "text-gray-300"
                                }`}>
                              {dayObj.day}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col overflow-auto">
                       <div className="grid grid-cols-8 flex-shrink-0">
                          <div className="p-4 border-b border-r border-gray-200"></div>
                          {getCurrentWeekDays().map((date, index) => (
                            <div key={index} className="p-4 text-center border-b border-r border-gray-200">
                               <p className="text-xs text-gray-500">{daysOfWeek[date.getDay()].substring(0,3)}</p>
                               <p className={`font-semibold text-lg ${date.getDate() === selectedDate ? 'text-purple-600' : 'text-gray-700'}`}>{date.getDate()}</p>
                            </div>
                          ))}
                       </div>
                       <div className="flex-1 overflow-y-auto">
                          {Array.from({ length: 24 }, (_, hour) => (
                             <div key={hour} className="grid grid-cols-8 h-16">
                                <div className="p-2 border-r border-b border-gray-200 text-right">
                                   <p className="text-xs text-gray-400">{hour % 12 === 0 ? 12 : hour % 12} {hour < 12 ? 'AM' : 'PM'}</p>
                                </div>
                                {Array.from({ length: 7 }).map((_, dayIndex) => (
                                   <div key={dayIndex} className="border-r border-b border-gray-200 hover:bg-gray-100"></div>
                                ))}
                             </div>
                          ))}
                       </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <PageContent title={currentPage} />
          )}
        </div>
      </main>
    </div>
  )
}