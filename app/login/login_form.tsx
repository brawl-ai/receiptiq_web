"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { LoginRequest } from "../types"
import Image from "next/image"

export function LoginForm({errors, loading, handleSubmit}: {errors?:string[], loading?:boolean, handleSubmit: (values: LoginRequest) => void } & React.HTMLAttributes<HTMLDivElement>) {
    const [formState, setFormState] = useState({
        email: "",
        password: "",
        remember_me: false
    })

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault(); 
        handleSubmit(formState);
    }

    return (
    <div className={cn("flex flex-col gap-6")}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={onSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your ReceiptIQ account
                </p>
              </div>
                {errors && <div className="text-center text-red-500 font-medium">
                    {errors.map((e, id) => <div className={"text-red-500"} key={id}>{e}</div>)}
                </div>}
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    data-umami-event="forgot_password_link@login"
                    href="/password/forgot"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                    id="password"
                    type="password"
                    required
                    value={formState.password}
                    onChange={(e) => setFormState({ ...formState, password: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-3">
                <Checkbox id="terms" checked={formState.remember_me} onCheckedChange={(e) => setFormState({ ...formState, remember_me:  Boolean(e) })} />
                <Label htmlFor="terms">Remember me</Label>
            </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                data-umami-event="login_button@login_form"
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a 
                    data-umami-event="create_account_link@login"
                    href="/signup"
                    className="underline underline-offset-4"
                >
                  Create account
                </a>
              </div>
            </div>
          </form>
          <div className="relative grid md:block">
            <Image
                width={600}
                height={400}
                src="/assets/images/bg2.jpg"
                alt="Authentication background"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.9] dark:contrast-more"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="/docs/ReceiptIQ Terms and Conditions.pdf">Terms of Service</a>
      </div>
    </div>
  )
}
