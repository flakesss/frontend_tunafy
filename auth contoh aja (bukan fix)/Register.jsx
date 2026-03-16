import React from 'react'
import { Button, Input } from '../../components/ui'

export default function Register() {
  return (
    <div className="p-4">
      <h1 className="mb-4 text-lg font-semibold">Register</h1>
      <div className="space-y-3">
        <Input placeholder="Name" />
        <Input placeholder="Email" type="email" />
        <Input placeholder="Password" type="password" />
        <Button>Create account</Button>
      </div>
    </div>
  )
}


