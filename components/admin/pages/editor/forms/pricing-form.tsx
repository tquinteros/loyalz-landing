"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ItemsField } from "../items-field"
import type { PricingSectionProps } from "@/lib/types/Pages"

type Props = {
  value: PricingSectionProps
  onChange: (next: PricingSectionProps) => void
}

type PricingCard = PricingSectionProps["cards"][number]

function parseFeatures(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
}

export function PricingForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<PricingSectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof PricingSectionProps>(
    key: K,
    next: PricingSectionProps[K],
  ) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="pricing-label">Label</Label>
        <Input
          id="pricing-label"
          value={local.label ?? ""}
          onChange={(e) => set("label", e.target.value || undefined)}
          placeholder="Plans"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="pricing-title">Title</Label>
        <Input
          id="pricing-title"
          value={local.title ?? ""}
          onChange={(e) => set("title", e.target.value || undefined)}
          placeholder="Simple pricing for every team"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="pricing-description">Description</Label>
        <Textarea
          id="pricing-description"
          rows={2}
          value={local.description ?? ""}
          onChange={(e) => set("description", e.target.value || undefined)}
          placeholder="Pick the plan that best fits your business."
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="pricing-bottom-message">Bottom message</Label>
        <Input
          id="pricing-bottom-message"
          value={local.bottomMessage ?? ""}
          onChange={(e) => set("bottomMessage", e.target.value || undefined)}
          placeholder="POS + Pay are included in all plans."
        />
      </div>

      <div className="space-y-2">
        <Label>Pricing cards</Label>
        <ItemsField<PricingCard>
          items={local.cards ?? []}
          onChange={(cards) => set("cards", cards)}
          createItem={() => ({
            title: "New plan",
            price: "$0",
            shops: "Up to 1 shop",
            savings: "0%",
            features: ["Feature one"],
          })}
          addLabel="Add pricing card"
          itemLabel={(it, i) => it.title || `Card ${i + 1}`}
          renderItem={(item, update) => (
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs">Title *</Label>
                <Input
                  value={item.title}
                  onChange={(e) => update({ title: e.target.value })}
                  placeholder="Total Start"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Price *</Label>
                <Input
                  value={item.price}
                  onChange={(e) => update({ price: e.target.value })}
                  placeholder="$79"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Amount of shops *</Label>
                <Input
                  value={item.shops}
                  onChange={(e) => update({ shops: e.target.value })}
                  placeholder="Up to 1 shop"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Savings (%) *</Label>
                <Input
                  value={item.savings}
                  onChange={(e) => update({ savings: e.target.value })}
                  placeholder="19%"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <Label className="text-xs">Features (one per line)</Label>
                <Textarea
                  rows={4}
                  value={(item.features ?? []).join("\n")}
                  onChange={(e) =>
                    update({
                      features: parseFeatures(e.target.value),
                    })
                  }
                  placeholder={"Club\nReviews\nPOS\nPay"}
                />
              </div>
            </div>
          )}
        />
      </div>
    </div>
  )
}
