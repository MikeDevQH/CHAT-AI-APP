"use client"  

import { useTheme } from "next-themes"  
import { useEffect, useState } from "react"  
import { motion } from "framer-motion"  
import { Moon, Sun } from "lucide-react"  

export default function ThemeToggle() {  
  const [mounted, setMounted] = useState(false)  
  const { theme, setTheme } = useTheme()  

  useEffect(() => {  
    setMounted(true)  
  }, [])  

  if (!mounted) {  
    return null  
  }  

  const toggleTheme = () => {  
    setTheme(theme === "light" ? "dark" : "light")  
  }  

  return (  
    <motion.button  
      className={`relative w-16 h-8 rounded-full p-1 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 ${theme === "light" ? "bg-gray-300" : "bg-gray-700"}`}  
      onClick={toggleTheme}  
      aria-label="Toggle theme"  
      whileTap={{ scale: 0.95 }}  
    >  
      <motion.div  
        className={`absolute w-6 h-6 rounded-full shadow-md flex items-center justify-center ${theme === "light" ? "bg-white" : "bg-gray-800"}`}  
        animate={{  
          x: theme === "light" ? 0 : 32,  
        }}  
        transition={{  
          type: "spring",  
          stiffness: 500,  
          damping: 30,  
        }}  
      >  
        <motion.div  
          animate={{  
            rotate: theme === "light" ? 0 : 180,  
          }}  
        >  
          {theme === "light" ? (  
            <Sun className="w-4 h-4 text-yellow-500" />  
          ) : (  
            <Moon className="w-4 h-4 text-blue-500" />  
          )}  
        </motion.div>  
      </motion.div>  
    </motion.button>  
  )  
}