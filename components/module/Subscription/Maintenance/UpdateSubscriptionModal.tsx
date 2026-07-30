/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Loading from "@/components/shared/Loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdatePlanMutation } from "@/redux/api/adminDashboardApi";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Price {
  duration: "Monthly" | "Annually";
  price: number;
}

interface PlanData {
  id: string;
  category: "BASIC" | "PROFESSIONAL" | "EUROPEAN";
  name: string;
  description: string;
  prices: Price[];
  technicianLimit: number;
  hasTrial: boolean;
  features: string[];
  isActive: boolean;
}

interface UpdateSubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: any;
}

const ALL_FEATURES = [
  'Full diagnostic process engine (strict step control)',
  'Mechanical + basic electrical + OBD-II flow',
  'Standard branching logic',
  'Core test types (visual, spark, fuel, compression)',
];

export function UpdateSubscriptionModal({
  open,
  onOpenChange,
  data,
}: UpdateSubscriptionModalProps) {
  const [updatePlan, { isLoading: isUpdating }] = useUpdatePlanMutation();

  const [category, setCategory] = useState<PlanData["category"]>("BASIC");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [technicianLimit, setTechnicianLimit] = useState(3);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const [prices, setPrices] = useState<Price[]>([
    { duration: "Monthly", price: 0 },
    { duration: "Annually", price: 0 },
  ]);
  const [inactiveFeatures, setInactiveFeatures] = useState<string[]>([]);

  useEffect(() => {
    if (!data) return;
    setCategory(data.category);
    setName(data.name);
    setDescription(data.description);
    setTechnicianLimit(data.technicianLimit);
    setSelectedFeatures(
      (data.features ?? []).map((f: any) =>
        typeof f === "object" ? f.name : f
      )
    );
    setInactiveFeatures(
      (data.features ?? [])
        .filter((f: any) => typeof f === "object" && f.isActive === false)
        .map((f: any) => f.name)
    );
    setPrices(
      data.prices?.length
        ? data.prices
        : [
          { duration: "Monthly", price: 0 },
          { duration: "Annually", price: 0 },
        ],
    );
  }, [data]);

  const updatePrice = (duration: Price["duration"], value: number) => {
    setPrices((prev) =>
      prev.map((p) => (p.duration === duration ? { ...p, price: value } : p)),
    );
  };

  const toggleFeature = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature],
    );
  };

  const removeFeature = (feature: string) => {
    setSelectedFeatures((prev) => prev.filter((f) => f !== feature));
  };

  const handleSave = async () => {
    if (!data?.id) {
      console.error("No plan ID found", data);
      return;
    }

    const payload = {
      category,
      prices,
      name,
      description,
      technicianLimit,
      features: selectedFeatures,
    };

    try {
      const res = (await updatePlan({
        id: data.id,
        body: payload,
      }).unwrap()) as any;

      if (res?.success) {
        toast.success(res.message || "Plan updated successfully!");
      }

      onOpenChange(false);
    } catch (err: any) {
      toast.error(
        err?.data?.message || "Failed to update plan. Please try again.",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Subscription</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Plan Information</h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Category */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Plan Category
                </Label>
                <Select
                  value={category}
                  onValueChange={(v) => setCategory(v as PlanData["category"])}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BASIC">BASIC</SelectItem>
                    <SelectItem value="PROFESSIONAL">PROFESSIONAL</SelectItem>
                    <SelectItem value="EUROPEAN">EUROPEAN</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Plan Name
                </Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Basic Shop Plan"
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Description
                </Label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Plan description..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Monthly Price (USD)
                </Label>
                <Input
                  type="number"
                  min={0}
                  value={
                    prices.find((p) => p.duration === "Monthly")?.price ?? 0
                  }
                  onChange={(e) =>
                    updatePrice("Monthly", Number(e.target.value))
                  }
                />
              </div>

              {/* Annually Price */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Annually Price (USD)
                </Label>
                <Input
                  type="number"
                  min={0}
                  value={
                    prices.find((p) => p.duration === "Annually")?.price ?? 0
                  }
                  onChange={(e) =>
                    updatePrice("Annually", Number(e.target.value))
                  }
                />
              </div>

              {/* Technician Limit */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Technician Limit
                </Label>
                <Input
                  type="number"
                  min={1}
                  value={technicianLimit}
                  onChange={(e) => setTechnicianLimit(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Features</h3>

            {/* Selected feature tags */}
            {selectedFeatures.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedFeatures.map((feature) => (
                  <Badge
                    key={feature}
                    variant="secondary"
                    className="bg-[#e9f0ff] text-sm text-[#4F5655] rounded-md py-2 px-3 flex items-center gap-2"
                  >
                    {feature}
                    <button
                      onClick={() => removeFeature(feature)}
                      disabled={inactiveFeatures.includes(feature)}
                      className={cn(
                        "ml-1 hover:opacity-70 transition-opacity",
                        inactiveFeatures.includes(feature) && "opacity-30 cursor-not-allowed"
                      )}
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Feature checkboxes */}
            <div className="space-y-3 border-t pt-4">
              {ALL_FEATURES.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <Checkbox
                    id={feature}
                    checked={selectedFeatures.includes(feature)}
                    onCheckedChange={() => toggleFeature(feature)}
                    disabled={inactiveFeatures.includes(feature)}
                  />
                  <Label
                    htmlFor={feature}
                    className={cn(
                      "text-sm text-gray-700 cursor-pointer font-normal transition-opacity",
                      inactiveFeatures.includes(feature) && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {feature}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 pt-2">
          <Button
            className="py-6 px-6 rounded-2xl"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isUpdating}
            className="bg-[#1b4075] py-6 px-6 hover:bg-blue-800 text-white rounded-2xl"
          >
            {isUpdating ? <Loading /> : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
