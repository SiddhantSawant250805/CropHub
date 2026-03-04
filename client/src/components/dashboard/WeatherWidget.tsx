import { motion } from "framer-motion";
import { Cloud, Droplets, Thermometer, Wind } from "lucide-react";

const weatherData = {
  temp: 28,
  humidity: 72,
  rainfall: 12,
  wind: 14,
  condition: "Partly Cloudy",
};

export function WeatherWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-6 col-span-full lg:col-span-2"
    >
      <div className="flex items-center gap-2 mb-4">
        <Cloud className="h-5 w-5 text-info" />
        <h3 className="font-semibold text-foreground">Weather Overview</h3>
      </div>
      <div className="flex items-center gap-6 flex-wrap">
        <div className="text-center">
          <p className="text-4xl font-bold text-foreground">{weatherData.temp}°C</p>
          <p className="text-sm text-muted-foreground mt-1">{weatherData.condition}</p>
        </div>
        <div className="flex-1 grid grid-cols-3 gap-4">
          {[
            { icon: Droplets, label: "Humidity", value: `${weatherData.humidity}%`, color: "text-info" },
            { icon: Cloud, label: "Rainfall", value: `${weatherData.rainfall}mm`, color: "text-primary" },
            { icon: Wind, label: "Wind", value: `${weatherData.wind} km/h`, color: "text-muted-foreground" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="flex flex-col items-center p-3 rounded-lg bg-muted/50"
            >
              <item.icon className={`h-5 w-5 mb-1 ${item.color}`} />
              <span className="text-lg font-semibold text-foreground">{item.value}</span>
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
