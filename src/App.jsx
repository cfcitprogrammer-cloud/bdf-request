import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Trash2,
  Plus,
  Loader2,
  CheckCircle2,
  FileText,
  LayoutList,
  Wallet,
} from "lucide-react";

function App() {
  const initialFormState = {
    distributorName: "",
    area: "",
    date: "",
    accountName: "",
    address: "",
    preparedBy: "",
    feeType: "",
    otherFeeType: "",
  };

  const initialItemState = {
    particulars: "",
    qty: 0,
    unitAmount: 0,
    totalAmount: 0,
    monthly: "",
    remarks: "",
  };

  // State Management
  const [formData, setFormData] = useState(initialFormState);
  const [items, setItems] = useState([{ ...initialItemState }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeeTypeChange = (value) => {
    setFormData((prev) => ({ ...prev, feeType: value }));
  };

  // Special handler for the Shadcn Select component
  const handlePreparedByChange = (value) => {
    setFormData((prev) => ({ ...prev, preparedBy: value }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    if (field === "qty" || field === "unitAmount") {
      const qty = parseFloat(newItems[index].qty) || 0;
      const unit = parseFloat(newItems[index].unitAmount) || 0;
      newItems[index].totalAmount = (qty * unit).toFixed(2);
    }
    setItems(newItems);
  };

  const addRow = () => setItems([...items, { ...initialItemState }]);
  const removeRow = (index) => setItems(items.filter((_, i) => i !== index));

  const resetForm = () => {
    setFormData(initialFormState);
    setItems([{ ...initialItemState }]);
    setIsSubmitted(false);
  };

  // Calculations
  const totalQty = items.reduce(
    (acc, curr) => acc + (parseFloat(curr.qty) || 0),
    0,
  );
  const totalUnitAmount = items.reduce(
    (acc, curr) => acc + (parseFloat(curr.unitAmount) || 0),
    0,
  );
  const grandTotal = items.reduce(
    (acc, curr) => acc + (parseFloat(curr.totalAmount) || 0),
    0,
  );

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...formData,
      items: items,
      totalQty,
      totalUnitAmount,
      grandTotal,
    };

    try {
      const scriptUrl =
        "https://script.google.com/macros/s/AKfycbzczZtyxSq9dFqe-ynJdW4E-X2sbdZKjgUaYFCbw3Kl-9t5Qcz_5HtIXNF3SWUtJtF0/exechttps://script.google.com/macros/s/AKfycbzczZtyxSq9dFqe-ynJdW4E-X2sbdZKjgUaYFCbw3Kl-9t5Qcz_5HtIXNF3SWUtJtF0/exec";

      const response = await fetch(scriptUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIsSubmitted(true); // Trigger the confirmation page
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const feeOptions = [
    "Listing Fee",
    "Vendors Fee",
    "Intro Discount",
    "Sampling",
    "Change of vendors fee",
    "Others",
  ];

  // List of names for the Prepared By dropdown
  const preparedByOptions = [
    "ABARRACOSO, NISSA",
    "AQUINO, NONI BRIAN",
    "BENDRINO, LOREYNE AYNE",
    "BUNAGAN, RUBYLYN",
    "CANDARE, ARNOLD",
    "CHENG, JACILET",
    "DAMIRAY, JAENA",
    "DE LARA, DELASPI",
    "DEL MUNDO, MARK SAM",
    "ENERIO-BAHILOT, MELISSA ANN",
    "ESTRELLOSO, RONALD",
    "KALAW, ELSA",
    "LORRO, MARIA LEILA",
    "MALONZO, MARLON",
    "MANNY, PECHA",
    "MOLINA, JOHN MEL",
    "NARCISO, JONARD",
    "PINEDA, JANELLA MARIE",
    "REYNOSO, CHARLOTH",
    "RICANOR, CONSTANTE",
    "RIVERA, MARY GRACE",
    "SEGOVIA, ROSE",
    "USON, ALPHY",
  ];

  // ==========================================
  // CONFIRMATION PAGE
  // ==========================================
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg shadow-xl text-center border-t-8 border-t-emerald-500 animate-in fade-in zoom-in duration-500">
          <CardContent className="pt-10 pb-8 space-y-6">
            <div className="flex justify-center">
              <CheckCircle2 className="w-24 h-24 text-emerald-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-slate-800">Success!</h2>
              <p className="text-slate-500">
                Your BDF Request for{" "}
                <span className="font-semibold text-slate-700">
                  {formData.distributorName}
                </span>{" "}
                has been successfully submitted and forwarded for approval.
              </p>
            </div>
            <div className="pt-4">
              <Button
                onClick={resetForm}
                className="w-full bg-slate-900 hover:bg-slate-800 text-lg py-6 rounded-xl transition-all"
              >
                Submit Another Form
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ==========================================
  // MAIN FORM PAGE
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 flex justify-center selection:bg-blue-100">
      <Card className="w-full max-w-8xl shadow-2xl border-0 overflow-hidden rounded-2xl pt-0">
        <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-8 py-10">
          <CardTitle className="text-3xl md:text-4xl font-bold tracking-tight">
            BDF Request Form
          </CardTitle>
          <CardDescription className="text-slate-300 text-base mt-2">
            Complete the details below to submit a new Business Development Fund
            request.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 bg-slate-50">
          <form onSubmit={handleSubmit}>
            <div className="p-6 md:p-10 space-y-10">
              {/* SECTION 1: General Details */}
              <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-2 border-b pb-4">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-slate-800">
                    General Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="distributorName"
                      className="text-slate-600 font-medium"
                    >
                      Distributor Name
                    </Label>
                    <Input
                      id="distributorName"
                      name="distributorName"
                      onChange={handleInputChange}
                      required
                      className="bg-slate-50/50 focus-visible:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="area"
                      className="text-slate-600 font-medium"
                    >
                      Area
                    </Label>
                    <Input
                      id="area"
                      name="area"
                      onChange={handleInputChange}
                      required
                      className="bg-slate-50/50 focus-visible:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="date"
                      className="text-slate-600 font-medium"
                    >
                      Date
                    </Label>
                    <Input
                      type="date"
                      id="date"
                      name="date"
                      onChange={handleInputChange}
                      required
                      className="bg-slate-50/50 focus-visible:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="accountName"
                      className="text-slate-600 font-medium"
                    >
                      Account Name
                    </Label>
                    <Input
                      id="accountName"
                      name="accountName"
                      onChange={handleInputChange}
                      required
                      className="bg-slate-50/50 focus-visible:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="address"
                      className="text-slate-600 font-medium"
                    >
                      Address
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      onChange={handleInputChange}
                      required
                      className="bg-slate-50/50 focus-visible:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="preparedBy"
                      className="text-slate-600 font-medium"
                    >
                      Prepared By
                    </Label>
                    <Select
                      value={formData.preparedBy}
                      onValueChange={handlePreparedByChange}
                      required
                    >
                      <SelectTrigger className="bg-slate-50/50 focus:ring-blue-500 w-full">
                        <SelectValue placeholder="Select a name..." />
                      </SelectTrigger>
                      <SelectContent>
                        {preparedByOptions.map((name) => (
                          <SelectItem key={name} value={name}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </section>

              {/* SECTION 2: Fee Category */}
              <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-2 border-b pb-4">
                  <Wallet className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-slate-800">
                    Fee Category
                  </h3>
                </div>

                <RadioGroup
                  onValueChange={handleFeeTypeChange}
                  required
                  className="flex flex-wrap gap-4 md:gap-8 pt-2"
                >
                  {feeOptions.map((fee) => (
                    <div
                      className="flex items-center space-x-3 cursor-pointer"
                      key={fee}
                    >
                      <RadioGroupItem
                        value={fee}
                        id={fee}
                        className="w-5 h-5 text-blue-600 border-slate-300"
                      />
                      <Label
                        htmlFor={fee}
                        className="cursor-pointer text-base font-medium text-slate-700"
                      >
                        {fee}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {formData.feeType === "Others" && (
                  <div className="mt-4 pt-4 animate-in fade-in slide-in-from-top-2 border-t border-dashed">
                    <Label
                      htmlFor="otherFeeType"
                      className="text-slate-600 mb-2 block"
                    >
                      Specify Other Fee:
                    </Label>
                    <Input
                      type="text"
                      name="otherFeeType"
                      placeholder="Enter details..."
                      onChange={handleInputChange}
                      required
                      className="max-w-md bg-slate-50/50 focus-visible:ring-blue-500"
                    />
                  </div>
                )}
              </section>

              {/* SECTION 3: Dynamic Items Table */}
              <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                  <div className="flex items-center gap-2">
                    <LayoutList className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-slate-800">
                      Request Breakdown
                    </h3>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addRow}
                    className="border-dashed border-2 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Line Item
                  </Button>
                </div>

                <div className="rounded-xl border border-slate-200 overflow-x-auto shadow-inner bg-slate-50/50">
                  <Table>
                    <TableHeader className="bg-slate-100/80">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="min-w-[250px] font-semibold text-slate-700">
                          Particulars
                        </TableHead>
                        <TableHead className="min-w-[100px] font-semibold text-slate-700">
                          Qty
                        </TableHead>
                        <TableHead className="min-w-[130px] font-semibold text-slate-700">
                          Unit Amt
                        </TableHead>
                        <TableHead className="min-w-[130px] font-semibold text-slate-700">
                          Total Amt
                        </TableHead>
                        <TableHead className="min-w-[150px] font-semibold text-slate-700">
                          Monthly
                        </TableHead>
                        <TableHead className="min-w-[180px] font-semibold text-slate-700">
                          Remarks
                        </TableHead>
                        <TableHead className="w-[70px] text-center font-semibold text-slate-700">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item, index) => (
                        <TableRow
                          key={index}
                          className="bg-white group hover:bg-slate-50/80 transition-colors"
                        >
                          <TableCell className="p-3">
                            <Input
                              type="text"
                              value={item.particulars}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "particulars",
                                  e.target.value,
                                )
                              }
                              required
                              className="border-slate-200 shadow-sm focus-visible:ring-blue-500"
                            />
                          </TableCell>
                          <TableCell className="p-3">
                            <Input
                              type="number"
                              value={item.qty || ""}
                              onChange={(e) =>
                                handleItemChange(index, "qty", e.target.value)
                              }
                              required
                              className="border-slate-200 shadow-sm focus-visible:ring-blue-500"
                            />
                          </TableCell>
                          <TableCell className="p-3">
                            <Input
                              type="number"
                              value={item.unitAmount || ""}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "unitAmount",
                                  e.target.value,
                                )
                              }
                              required
                              className="border-slate-200 shadow-sm focus-visible:ring-blue-500"
                            />
                          </TableCell>
                          <TableCell className="p-3">
                            <Input
                              type="number"
                              value={item.totalAmount}
                              readOnly
                              tabIndex={-1}
                              className="bg-slate-100/70 font-bold text-slate-700 border-transparent focus-visible:ring-0 shadow-none cursor-default"
                            />
                          </TableCell>
                          <TableCell className="p-3">
                            <Input
                              type="text"
                              value={item.monthly}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "monthly",
                                  e.target.value,
                                )
                              }
                              className="border-slate-200 shadow-sm focus-visible:ring-blue-500"
                            />
                          </TableCell>
                          <TableCell className="p-3">
                            <Input
                              type="text"
                              value={item.remarks}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "remarks",
                                  e.target.value,
                                )
                              }
                              className="border-slate-200 shadow-sm focus-visible:ring-blue-500"
                            />
                          </TableCell>
                          <TableCell className="p-3 text-center">
                            {items.length > 1 ? (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeRow(index)}
                                className="text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            ) : (
                              <div className="h-9 w-9"></div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow className="bg-slate-900 text-white hover:bg-slate-900">
                        <TableCell className="text-right font-semibold text-base py-4 rounded-bl-lg">
                          Grand Total:
                        </TableCell>
                        <TableCell className="font-semibold text-base">
                          {totalQty}
                        </TableCell>
                        <TableCell className="font-semibold text-base">
                          {totalUnitAmount.toFixed(2)}
                        </TableCell>
                        <TableCell className="font-bold text-emerald-400 text-lg tracking-wide">
                          {grandTotal.toFixed(2)}
                        </TableCell>
                        <TableCell
                          colSpan={3}
                          className="rounded-br-lg"
                        ></TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              </section>
            </div>

            {/* Submit Bar */}
            <div className="bg-slate-200/50 p-6 md:p-8 border-t border-slate-200 flex justify-end items-center">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto min-w-[250px] bg-blue-600 hover:bg-blue-700 text-white text-lg py-6 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                    Processing Request...
                  </>
                ) : (
                  "Submit Request"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
