import { Construction, TrendingUp } from "lucide-react"


import {  ChartContainer } from "../ui/chart"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

export const description = "A radial chart with text"

const chartData = [
  { browser: "safari", value: 200, fill: "var(--color-safari)" },
]

// const chartConfig = {
//   visitors: {
//     label: "Visitors",
//   },
//   safari: {
//     label: "Safari",
//     color: "var(--chart-2)",
//   },
// } 

export const DashboardCard =({title, description, endAngle, totalValue, lastMonthValue, footerText,chartData, chartConfig, color }) =>  {

 const data = [{
    name: title,
    totalValue: Number(totalValue || 0),
    fill: color || "#2563eb"
}]
 
    return (
    <Card className="flex flex-col w-full max-w-[300px]">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[200px]"
        >
          <RadialBarChart
            width={220}
            height={220}
            cx="50%"
            cy="50%"
            data={data}
            startAngle={0}
            endAngle={endAngle || 0}
            innerRadius={80}
            outerRadius={110}
            className="flex justify-center items-center mt-4"
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar background dataKey="totalValue"  cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false} >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {Number(totalValue || 0).toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Last Month: {lastMonthValue} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          {footerText}
        </div>
      </CardFooter>
    </Card>
  )
}
 export default DashboardCard;