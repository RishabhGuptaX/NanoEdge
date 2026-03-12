<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  <div className="space-y-1.5">
    <Label className="text-muted-foreground text-xs">Age</Label>
    <Input
      type="number"
      placeholder="e.g. 45"
      value={form.age}
      onChange={(e) => setForm({ ...form, age: e.target.value })}
      className="bg-secondary/50 border-border rounded-xl"
    />
  </div>

  <div className="space-y-1.5">
    <Label className="text-muted-foreground text-xs">Sex</Label>
    <Select value={form.sex} onValueChange={(v) => setForm({ ...form, sex: v })}>
      <SelectTrigger className="bg-secondary/50 border-border rounded-xl">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="1">Male</SelectItem>
        <SelectItem value="0">Female</SelectItem>
      </SelectContent>
    </Select>
  </div>
</div>

<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
  {(["diabetes", "hypertension", "obesity", "asthma", "tobacco"] as const).map((field) => (
    <div
      key={field}
      className="flex items-center justify-between bg-secondary/50 rounded-xl p-3 border border-border/50"
    >
      <Label className="text-xs text-muted-foreground capitalize">
        {field}
      </Label>
      <Switch
        checked={form[field]}
        onCheckedChange={(v) => setForm({ ...form, [field]: v })}
      />
    </div>
  ))}
</div>
