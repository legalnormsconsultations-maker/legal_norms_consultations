"use client";

import { Edit2, Plus, Save, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { CriticalActionDialog } from "@/components/ui/critical-action-dialog";

type PortfolioItem = {
  id: string;
  productName: string;
  category: string | null;
  phase: string | null;
  description: string | null;
  drugId?: string | null;
};

type DrugOption = {
  id: string;
  name: string;
};

const inputClassName =
  "mt-1 h-10 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15";

export function PortfolioWorkspace({
  initialItems,
  drugList,
}: {
  initialItems: PortfolioItem[];
  drugList: DrugOption[];
}) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [pendingDelete, setPendingDelete] = useState<PortfolioItem | null>(
    null,
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [useCustomName, setUseCustomName] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    const drugId = form.get("drugId") as string;
    let productName = form.get("productName") as string;

    if (!useCustomName && drugId) {
      const selectedDrug = drugList.find((d) => d.id === drugId);
      if (selectedDrug) productName = selectedDrug.name;
    }

    try {
      const url = editingItem
        ? `/api/portfolio/items/${editingItem.id}`
        : "/api/portfolio/items";
      const method = editingItem ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName,
          category: form.get("category") || null,
          phase: form.get("phase") || null,
          description: form.get("description") || null,
          drugId: useCustomName || !drugId ? null : drugId,
        }),
      });

      const result = (await response.json()) as {
        item?: PortfolioItem;
        error?: string;
      };

      if (!response.ok || !result.item) {
        throw new Error(result.error ?? "Could not save portfolio item.");
      }

      if (editingItem) {
        setItems((current) =>
          current.map((item) =>
            item.id === editingItem.id ? result.item! : item,
          ),
        );
        setEditingItem(null);
      } else {
        setItems((current) => [result.item!, ...current]);
        setShowForm(false);
      }

      formElement.reset();
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save portfolio item.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function removeItem() {
    if (!pendingDelete) return;
    setError("");
    try {
      const response = await fetch(`/api/portfolio/items/${pendingDelete.id}`, {
        method: "DELETE",
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok)
        throw new Error(result.error ?? "Could not remove item.");

      setItems((current) =>
        current.filter((item) => item.id !== pendingDelete.id),
      );
      setPendingDelete(null);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not remove portfolio item.",
      );
    }
  }

  const renderForm = (item?: PortfolioItem) => (
    <form
      onSubmit={handleSubmit}
      className={`grid gap-4 border-y border-border bg-secondary/70 px-4 py-5 sm:grid-cols-2 sm:px-6 ${item ? "my-2 rounded-lg border-x" : ""}`}
    >
      <div className="sm:col-span-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Product</span>
          <button
            type="button"
            onClick={() => setUseCustomName(!useCustomName)}
            className="text-xs text-teal-700 hover:underline"
          >
            {useCustomName
              ? "Link to existing drug instead"
              : "Enter custom name instead"}
          </button>
        </div>

        {useCustomName ? (
          <input
            className={inputClassName}
            name="productName"
            minLength={2}
            maxLength={255}
            defaultValue={item?.productName || ""}
            placeholder="Type custom product name..."
            required
          />
        ) : (
          <select
            className={inputClassName}
            name="drugId"
            defaultValue={item?.drugId || ""}
            required
          >
            <option value="">-- Select from Drug Database --</option>
            {drugList.map((drug) => (
              <option key={drug.id} value={drug.id}>
                {drug.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <label className="block text-sm font-medium text-foreground">
        Category
        <select
          className={inputClassName}
          name="category"
          defaultValue={item?.category || "Drug"}
        >
          <option>Drug</option>
          <option>Biological</option>
          <option>Medical device</option>
          <option>IVD</option>
          <option>Cosmetic</option>
          <option>Food / nutraceutical</option>
          <option>Other</option>
        </select>
      </label>

      <label className="block text-sm font-medium text-foreground">
        Development stage
        <select
          className={inputClassName}
          name="phase"
          defaultValue={item?.phase || ""}
        >
          <option value="">Not specified</option>
          <option>Pre-clinical</option>
          <option>Clinical development</option>
          <option>Regulatory review</option>
          <option>Approved / marketed</option>
          <option>Post-market</option>
        </select>
      </label>

      <label className="block text-sm font-medium text-foreground sm:col-span-2">
        Notes
        <input
          className={inputClassName}
          name="description"
          maxLength={2000}
          defaultValue={item?.description || ""}
          placeholder="Optional context"
        />
      </label>

      <div className="flex items-center gap-3 sm:col-span-2">
        <button
          type="submit"
          disabled={busy}
          className="h-10 inline-flex items-center gap-2 rounded-md bg-teal-900 px-4 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
        >
          <Save size={16} /> {busy ? "Saving..." : "Save item"}
        </button>
        {item && (
          <button
            type="button"
            onClick={() => setEditingItem(null)}
            className="h-10 inline-flex items-center gap-2 rounded-md bg-neutral-200 px-4 text-sm font-semibold text-neutral-800 hover:bg-neutral-300"
          >
            Cancel
          </button>
        )}
        {error && (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        )}
      </div>
    </form>
  );

  return (
    <div className="mx-auto max-w-6xl space-y-7">
      <header className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-800">
            My workspace
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-foreground">
            Medical portfolio
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Track products, programs, and development stages you own or manage.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingItem(null);
            setShowForm((value) => !value);
            setUseCustomName(false);
          }}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-teal-900 px-4 text-sm font-semibold text-white hover:bg-teal-800"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Cancel" : "Add portfolio item"}
        </button>
      </header>

      {showForm && renderForm()}

      {items.length === 0 ? (
        <div className="border-y border-border py-12 text-center">
          <h2 className="text-base font-semibold text-foreground">
            Your portfolio is empty
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a product or program to begin tracking its stage.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-neutral-200">
          {items.map((item) =>
            editingItem?.id === item.id ? (
              <div key={`edit-${item.id}`}>{renderForm(item)}</div>
            ) : (
              <article
                key={item.id}
                className="grid gap-3 py-5 sm:grid-cols-[minmax(0,1fr)_180px_180px_auto] sm:items-center group"
              >
                <div>
                  <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    {item.productName}
                    {item.drugId && (
                      <span
                        title="Linked to Central Drug Registry"
                        className="w-2 h-2 rounded-full bg-teal-500 inline-block"
                      ></span>
                    )}
                  </h2>
                  {item.description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  {item.category ?? "Uncategorized"}
                </span>
                <span className="text-sm text-muted-foreground">
                  {item.phase ?? "Stage not set"}
                </span>
                <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => {
                      setUseCustomName(!item.drugId);
                      setEditingItem(item);
                      setShowForm(false);
                    }}
                    className="inline-flex h-8 items-center justify-center gap-1 rounded-md px-2 text-xs text-muted-foreground hover:bg-neutral-100 hover:text-neutral-900"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingDelete(item)}
                    className="inline-flex h-8 items-center justify-center gap-1 rounded-md px-2 text-xs text-muted-foreground hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </article>
            ),
          )}
        </div>
      )}

      {pendingDelete && (
        <CriticalActionDialog
          title="Remove portfolio item?"
          description={`You are about to remove ${pendingDelete.productName} from your portfolio.`}
          consequenceExplanation="The item will be deleted from your portfolio. Its change will be recorded in the audit trail. This does not delete its drug or regulatory records."
          confirmationString={`DELETE ${pendingDelete.productName}`}
          actionLabel="Remove item"
          onConfirm={removeItem}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
}
