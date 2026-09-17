import { useState, useEffect } from "react";
import {
  HashRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
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
  CardFooter,
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
  Paperclip,
  LayoutDashboard,
  ArrowLeft,
  Eye,
  Lock,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";

// Initialize Supabase Client
const supabaseUrl = "https://qisoolrsasiszadseteg.supabase.co";
const supabaseKey = "sb_publishable_RHqdlZJunyWDxmK7z7ekYA_XCwV889X";
const supabase = createClient(supabaseUrl, supabaseKey);

// Wrapper component to provide the HashRouter
export default function App() {
  return (
    <HashRouter>
      <AppLayout />
    </HashRouter>
  );
}

function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Check active session on load and subscribe to auth changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const currentView = location.pathname; // "/" or "/admin"

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col selection:bg-blue-100">
      {/* Navigation Bar */}
      <div className="bg-white border-b px-4 py-3 flex justify-between items-center shadow-sm sticky top-0 z-10">
        <div className="font-bold text-slate-800 text-lg flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          BDF Portal
        </div>
        <div className="flex gap-2">
          <Button
            variant={currentView === "/" ? "default" : "outline"}
            onClick={() => navigate("/")}
            size="sm"
            className={currentView === "/" ? "bg-slate-900 text-white" : ""}
          >
            <Plus className="w-4 h-4 mr-1 md:mr-2" />
            <span className="hidden md:inline">Submit Request</span>
            <span className="md:hidden">New</span>
          </Button>
          <Button
            variant={currentView.includes("/admin") ? "default" : "outline"}
            onClick={() => navigate("/admin")}
            size="sm"
            className={
              currentView.includes("/admin") ? "bg-slate-900 text-white" : ""
            }
          >
            <LayoutDashboard className="w-4 h-4 mr-1 md:mr-2" />
            <span className="hidden md:inline">Admin Dashboard</span>
            <span className="md:hidden">Admin</span>
          </Button>
        </div>
      </div>

      <main className="flex-1 p-2 md:p-4 flex justify-center">
        <Routes>
          <Route path="/" element={<RequestForm />} />
          <Route
            path="/admin"
            element={
              isAuthLoading ? (
                <div className="flex justify-center items-center h-[60vh]">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : session ? (
                <AdminDashboard session={session} />
              ) : (
                <AdminLogin />
              )
            }
          />
        </Routes>
      </main>
    </div>
  );
}

// ==========================================
// ADMIN LOGIN COMPONENT
// ==========================================
function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center p-2 w-full h-[70vh]">
      <Card className="w-full max-w-sm shadow-xl border-t-4 border-t-blue-600 animate-in fade-in zoom-in-95 duration-300">
        <CardHeader className="space-y-1 text-center pb-4">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-blue-100 rounded-full">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
          <CardDescription>
            Enter your credentials to view the dashboard
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

// ==========================================
// ADMIN DASHBOARD COMPONENT (With Export & Pagination)
// ==========================================
function AdminDashboard({ session }) {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requestItems, setRequestItems] = useState([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100;

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("bdf_requests")
        .select("*")
        .order("id", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
      setCurrentPage(1); // Reset to page 1 when data reloads
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const viewDetails = async (request) => {
    setSelectedRequest(request);
    setIsLoadingItems(true);
    try {
      const { data, error } = await supabase
        .from("bdf_request_items")
        .select("*")
        .eq("request_id", request.id);

      if (error) throw error;
      setRequestItems(data || []);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setIsLoadingItems(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Main Dashboard Export
  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Date",
      "Distributor Name",
      "Account Name",
      "Area",
      "Prepared By",
      "Fee Type",
      "Total Qty",
      "Grand Total",
    ];

    const csvData = requests.map((req) => {
      const feeTypeFinal =
        req.fee_type === "Others" ? req.other_fee_type : req.fee_type;
      const formattedId = `BDF-${String(req.id).padStart(6, "0")}`;
      return [
        formattedId,
        req.date,
        `"${req.distributor_name}"`, // Quote strings to prevent comma splitting issues
        `"${req.account_name}"`,
        `"${req.area}"`,
        `"${req.prepared_by}"`,
        `"${feeTypeFinal}"`,
        req.total_qty,
        req.grand_total,
      ];
    });

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `bdf_requests_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Specific Request Details Export
  const handleExportDetailsCSV = () => {
    if (!selectedRequest || requestItems.length === 0) return;

    const isListingFee = selectedRequest.fee_type === "Listing Fee";
    const feeTypeFinal =
      selectedRequest.fee_type === "Others"
        ? selectedRequest.other_fee_type
        : selectedRequest.fee_type;

    const headers = [
      "Distributor",
      "Date",
      "Area",
      "Fee Type",
      "Prepared By",
      "Particulars",
    ];

    if (isListingFee) {
      headers.push("SKU", "Store");
    }
    headers.push("Qty", "Unit Amount", "Total Amount", "Monthly", "Remarks");

    const csvData = requestItems.map((item) => {
      const row = [
        `"${selectedRequest.distributor_name || ""}"`,
        selectedRequest.date,
        `"${selectedRequest.area || ""}"`,
        `"${feeTypeFinal || ""}"`,
        `"${selectedRequest.prepared_by || ""}"`,
        `"${item.particulars || ""}"`,
      ];

      if (isListingFee) {
        row.push(`"${item.sku || ""}"`, `"${item.store || ""}"`);
      }

      row.push(
        item.qty || 0,
        item.unit_amount || 0,
        item.total_amount || 0,
        `"${item.monthly || ""}"`,
        `"${item.remarks || ""}"`,
      );
      return row;
    });

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    const paddedId = String(selectedRequest.id).padStart(6, "0");
    link.setAttribute("href", url);
    link.setAttribute("download", `BDF-${paddedId}_Items.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pagination Logic
  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRequests = requests.slice(indexOfFirstItem, indexOfLastItem);

  if (selectedRequest) {
    return (
      <Card className="w-full p-0 max-w-8xl shadow-lg border-0 overflow-hidden rounded-xl h-fit animate-in fade-in zoom-in-95 duration-200">
        <CardHeader className="bg-slate-900 text-white px-4 py-4 md:px-6 md:py-5 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-white hover:bg-slate-800 hover:text-white -ml-2 h-8 w-8"
                onClick={() => setSelectedRequest(null)}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              Request Details #{selectedRequest.id}
            </CardTitle>
            <CardDescription className="text-slate-300 mt-1 ml-9">
              Distributor: {selectedRequest.distributor_name}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportDetailsCSV}
            disabled={requestItems.length === 0}
            className="text-slate-900 bg-white hover:bg-slate-100 border-none h-8 hidden sm:flex"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Items
          </Button>
        </CardHeader>
        <CardContent className="p-3 md:p-6 bg-slate-50 space-y-4 md:space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <div>
              <p className="text-xs text-slate-500 font-medium">Date</p>
              <p className="text-sm font-semibold text-slate-800">
                {selectedRequest.date}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Area</p>
              <p className="text-sm font-semibold text-slate-800">
                {selectedRequest.area}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Fee Type</p>
              <p className="text-sm font-semibold text-slate-800">
                {selectedRequest.fee_type === "Others"
                  ? selectedRequest.other_fee_type
                  : selectedRequest.fee_type}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Prepared By</p>
              <p className="text-sm font-semibold text-slate-800">
                {selectedRequest.prepared_by}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 overflow-x-auto bg-white shadow-sm">
            <Table>
              <TableHeader className="bg-slate-100/80">
                <TableRow>
                  <TableHead className="min-w-[150px]">Particulars</TableHead>
                  {selectedRequest.fee_type === "Listing Fee" && (
                    <>
                      <TableHead>SKU</TableHead>
                      <TableHead>Store</TableHead>
                    </>
                  )}
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Unit Amt</TableHead>
                  <TableHead className="text-right">Total Amt</TableHead>
                  <TableHead>Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingItems ? (
                  <TableRow>
                    <TableCell
                      colSpan={
                        selectedRequest.fee_type === "Listing Fee" ? 7 : 5
                      }
                      className="text-center py-8 text-slate-500"
                    >
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                      Loading items...
                    </TableCell>
                  </TableRow>
                ) : requestItems.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={
                        selectedRequest.fee_type === "Listing Fee" ? 7 : 5
                      }
                      className="text-center py-8 text-slate-500"
                    >
                      No line items found.
                    </TableCell>
                  </TableRow>
                ) : (
                  requestItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium text-slate-700">
                        {item.particulars}
                      </TableCell>
                      {selectedRequest.fee_type === "Listing Fee" && (
                        <>
                          <TableCell className="text-slate-600">
                            {item.sku || "-"}
                          </TableCell>
                          <TableCell className="text-slate-600">
                            {item.store || "-"}
                          </TableCell>
                        </>
                      )}
                      <TableCell className="text-right text-slate-600">
                        {item.qty}
                      </TableCell>
                      <TableCell className="text-right text-slate-600">
                        {item.unit_amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-slate-800">
                        {item.total_amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-slate-500 text-xs">
                        {item.remarks || "-"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
              <TableFooter>
                <TableRow className="bg-slate-50">
                  <TableCell
                    colSpan={selectedRequest.fee_type === "Listing Fee" ? 5 : 3}
                    className="text-right font-bold text-slate-700"
                  >
                    Grand Total
                  </TableCell>
                  <TableCell className="text-right font-bold text-emerald-600 text-base">
                    {selectedRequest.grand_total?.toFixed(2) || "0.00"}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full p-0 max-w-8xl shadow-lg border-0 overflow-hidden rounded-xl h-fit animate-in fade-in duration-300 flex flex-col">
      <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-4 py-4 md:px-6 md:py-5 flex flex-row justify-between items-center">
        <div>
          <CardTitle className="text-xl md:text-2xl font-bold tracking-tight">
            Admin Dashboard
          </CardTitle>
          <CardDescription className="text-slate-300 text-sm mt-1">
            Manage and review all submitted BDF requests.
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="text-slate-900 bg-white hover:bg-slate-100 border-none h-8 hidden sm:flex"
            disabled={requests.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="text-slate-900 bg-slate-200 hover:bg-slate-300 border-none h-8"
          >
            <LogOut className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0 bg-white border-x border-slate-200 overflow-x-auto flex-1">
        <Table>
          <TableHeader className="bg-slate-50 border-b">
            <TableRow className="[&>th]:whitespace-nowrap">
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Distributor</TableHead>
              <TableHead>Account Name</TableHead>
              <TableHead>Fee Type</TableHead>
              <TableHead className="text-right">Total Amount</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-12 text-slate-500"
                >
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-blue-600" />
                  Loading requests...
                </TableCell>
              </TableRow>
            ) : requests.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-12 text-slate-500"
                >
                  No requests found.
                </TableCell>
              </TableRow>
            ) : (
              currentRequests.map((req) => (
                <TableRow
                  key={req.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <TableCell className="font-medium text-slate-500">
                    BDF-{String(req.id).padStart(6, "0")}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {req.date}
                  </TableCell>
                  <TableCell className="text-slate-600 text-xs">
                    {req.area}
                  </TableCell>
                  <TableCell className="font-semibold text-slate-800">
                    {req.distributor_name}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {req.account_name}
                  </TableCell>
                  <TableCell>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap">
                      {req.fee_type === "Others"
                        ? req.other_fee_type
                        : req.fee_type}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-bold text-slate-700">
                    {req.grand_total?.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => viewDetails(req)}
                      className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Eye className="w-4 h-4 mr-1" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>

      {/* Pagination Controls */}
      {requests.length > 0 && (
        <div className="bg-slate-50 border border-t-0 border-slate-200 rounded-b-xl px-4 py-3 flex items-center justify-between">
          <div className="text-sm text-slate-500 font-medium">
            Showing {indexOfFirstItem + 1} to{" "}
            {Math.min(indexOfLastItem, requests.length)} of {requests.length}{" "}
            entries
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 text-xs font-medium"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Prev
            </Button>
            <div className="flex items-center px-2 text-sm font-medium text-slate-700">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="h-8 text-xs font-medium"
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

// ==========================================
// MAIN FORM COMPONENT
// ==========================================
function RequestForm() {
  const initialFormState = {
    distributorName: "",
    area: "",
    date: "",
    accountName: "",
    address: "",
    preparedBy: "",
    otherPreparedBy: "", // <-- NEW FIELD FOR CUSTOM NAME
    feeType: "",
    otherFeeType: "",
  };

  const initialItemState = {
    particulars: "",
    sku: "",
    store: "",
    qty: 0,
    unitAmount: 0,
    totalAmount: 0,
    monthly: "",
    remarks: "",
  };

  // State Management
  const [formData, setFormData] = useState(initialFormState);
  const [items, setItems] = useState([{ ...initialItemState }]);
  const [attachments, setAttachments] = useState([]);
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

  const handlePreparedByChange = (value) => {
    setFormData((prev) => ({ ...prev, preparedBy: value }));
  };

  const handleAreaChange = (value) => {
    setFormData((prev) => ({ ...prev, area: value }));
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

  const handleFileChange = (e) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const addRow = () => setItems([...items, { ...initialItemState }]);
  const removeRow = (index) => setItems(items.filter((_, i) => i !== index));

  const resetForm = () => {
    setFormData(initialFormState);
    setItems([{ ...initialItemState }]);
    setAttachments([]);
    setIsSubmitted(false);
  };

  // Calculations
  const isListingFee = formData.feeType === "Listing Fee";
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

  // Submit Handler connected to Supabase and Google Apps Script
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Get the final preparedBy value depending on the dropdown selection
    const finalPreparedBy =
      formData.preparedBy === "Others"
        ? formData.otherPreparedBy
        : formData.preparedBy;

    try {
      // 1. Insert main request data
      const { data: requestData, error: requestError } = await supabase
        .from("bdf_requests")
        .insert([
          {
            distributor_name: formData.distributorName,
            area: formData.area,
            date: formData.date,
            account_name: formData.accountName,
            address: formData.address,
            prepared_by: finalPreparedBy, // <-- USES NEW VARIABLE
            fee_type: formData.feeType,
            other_fee_type: formData.otherFeeType,
            total_qty: totalQty,
            total_unit_amount: totalUnitAmount,
            grand_total: grandTotal,
          },
        ])
        .select()
        .single();

      if (requestError) throw requestError;

      const requestId = requestData.id;

      // 2. Insert line items
      const itemsToInsert = items.map((item) => ({
        request_id: requestId,
        particulars: item.particulars,
        sku: isListingFee ? item.sku : null,
        store: isListingFee ? item.store : null,
        qty: parseFloat(item.qty) || 0,
        unit_amount: parseFloat(item.unitAmount) || 0,
        total_amount: parseFloat(item.totalAmount) || 0,
        monthly: item.monthly,
        remarks: item.remarks,
      }));

      const { error: itemsError } = await supabase
        .from("bdf_request_items")
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      // 3. Upload attachments to Supabase Storage and gather Public URLs
      const uploadedFiles = [];
      if (attachments.length > 0) {
        for (const file of attachments) {
          const filePath = `${requestId}/${Date.now()}_${file.name}`;

          console.log(`Attempting to upload: ${file.name}...`);

          const { error: uploadError } = await supabase.storage
            .from("bdf_attachments")
            .upload(filePath, file);

          if (uploadError) {
            console.error("❌ File upload error details:", uploadError.message);
          } else {
            console.log(`✅ Upload successful: ${file.name}`);

            const { data: urlData } = supabase.storage
              .from("bdf_attachments")
              .getPublicUrl(filePath);

            uploadedFiles.push({
              name: file.name,
              url: urlData.publicUrl,
            });
          }
        }
      }

      console.log("Final URLs being sent to Google:", uploadedFiles);

      // 4. Trigger Webhook to Google Apps Script for Email Routing
      try {
        const gasPayload = {
          id: requestId, // Passes the Supabase ID to sync databases
          distributorName: formData.distributorName,
          area: formData.area,
          date: formData.date,
          accountName: formData.accountName,
          address: formData.address,
          preparedBy: finalPreparedBy, // <-- USES NEW VARIABLE
          feeType: formData.feeType,
          otherFeeType: formData.otherFeeType,
          totalQty: totalQty,
          totalUnitAmount: totalUnitAmount,
          grandTotal: grandTotal,
          items: items,
          attachments: uploadedFiles, // Passes the public URLs to Google Script
        };

        // WARNING: Replace this string with your Google Apps Script Web App URL
        const GOOGLE_SCRIPT_URL =
          "https://script.google.com/macros/s/AKfycbwFOuqO-BdTqI6_5GIV9DqNDAgQbUh6s419EHyMbVsczudLYEcTT0J_mzlOQUA1fX9v/exec";

        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(gasPayload),
        });
      } catch (gasError) {
        console.error("Error triggering email workflow:", gasError);
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const areaOptions = [
    "BICOL",
    "CENTRAL EASTERN VISAYAS",
    "CENTRAL LUZON",
    "DIRECT",
    "EXPORT",
    "MINDANAO",
    "MODERN TRADE",
    "NCR",
    "NORTH EASTERN LUZON",
    "NORTH WESTERN LUZON",
    "PALAWAN",
    "SOUTH LUZON",
    "VAN SALES",
    "WESTERN VISAYAS",
  ];

  const feeOptions = [
    "Listing Fee",
    "Vendors Fee",
    "Intro Discount",
    "Sampling",
    "Change of vendors fee",
    "Others",
  ];

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
    "Others", // <-- NEW OPTION ADDED HERE
  ];

  // Confirmation View
  if (isSubmitted) {
    return (
      <div className="flex items-center justify-center p-2 w-full h-[60vh]">
        <Card className="w-full p-0 max-w-sm shadow-xl text-center border-t-4 border-t-emerald-500 animate-in fade-in zoom-in duration-500">
          <CardContent className="pt-6 pb-6 space-y-4">
            <div className="flex justify-center">
              <CheckCircle2 className="w-16 h-16 text-emerald-500" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-800">Success!</h2>
              <p className="text-sm text-slate-500">
                BDF Request for{" "}
                <span className="font-semibold text-slate-700">
                  {formData.distributorName}
                </span>{" "}
                submitted.
              </p>
            </div>
            <div className="pt-2">
              <Button
                onClick={resetForm}
                className="w-full bg-slate-900 hover:bg-slate-800 text-sm py-2 h-9 rounded-lg"
              >
                Submit Another
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card className="w-full p-0 max-w-8xl shadow-lg border-0 overflow-hidden rounded-xl h-fit animate-in fade-in duration-300">
      <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-4 py-4 md:px-6 md:py-5">
        <CardTitle className="text-xl md:text-2xl font-bold tracking-tight">
          BDF Request Form
        </CardTitle>
        <CardDescription className="text-slate-300 text-xs md:text-sm mt-1">
          Complete the details below to submit a new request.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0 bg-slate-50">
        <form onSubmit={handleSubmit}>
          <div className="p-3 md:p-6 space-y-4">
            {/* SECTION 1: General Details */}
            <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 space-y-3">
              <div className="flex items-center gap-2 border-b pb-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-slate-800">
                  General Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
                <div className="space-y-1">
                  <Label
                    htmlFor="distributorName"
                    className="text-xs text-slate-600 font-medium"
                  >
                    Distributor Name
                  </Label>
                  <Input
                    id="distributorName"
                    name="distributorName"
                    value={formData.distributorName}
                    onChange={handleInputChange}
                    required
                    className="h-8 text-sm bg-slate-50/50"
                  />
                </div>
                <div className="space-y-1">
                  <Label
                    htmlFor="area"
                    className="text-xs text-slate-600 font-medium"
                  >
                    Area
                  </Label>
                  <Select
                    value={formData.area}
                    onValueChange={handleAreaChange}
                    required
                  >
                    <SelectTrigger className="h-8 w-full text-sm bg-slate-50/50">
                      <SelectValue placeholder="Select area..." />
                    </SelectTrigger>
                    <SelectContent>
                      {areaOptions.map((area) => (
                        <SelectItem key={area} value={area} className="text-sm">
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label
                    htmlFor="date"
                    className="text-xs text-slate-600 font-medium"
                  >
                    Date
                  </Label>
                  <Input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="h-8 text-sm bg-slate-50/50"
                  />
                </div>
                <div className="space-y-1">
                  <Label
                    htmlFor="accountName"
                    className="text-xs text-slate-600 font-medium"
                  >
                    Account Name
                  </Label>
                  <Input
                    id="accountName"
                    name="accountName"
                    value={formData.accountName}
                    onChange={handleInputChange}
                    required
                    className="h-8 text-sm bg-slate-50/50"
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <Label
                    htmlFor="address"
                    className="text-xs text-slate-600 font-medium"
                  >
                    Address
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="h-8 text-sm bg-slate-50/50"
                  />
                </div>
                <div className="space-y-1 md:col-span-1">
                  <Label
                    htmlFor="preparedBy"
                    className="text-xs text-slate-600 font-medium"
                  >
                    Prepared By
                  </Label>
                  <Select
                    value={formData.preparedBy}
                    onValueChange={handlePreparedByChange}
                    required
                  >
                    <SelectTrigger className="h-8 w-full text-sm bg-slate-50/50">
                      <SelectValue placeholder="Select name..." />
                    </SelectTrigger>
                    <SelectContent>
                      {preparedByOptions.map((name) => (
                        <SelectItem key={name} value={name} className="text-sm">
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* <-- NEW CONDITIONAL INPUT RENDERED HERE --> */}
                  {formData.preparedBy === "Others" && (
                    <Input
                      type="text"
                      name="otherPreparedBy"
                      value={formData.otherPreparedBy}
                      placeholder="Please specify..."
                      onChange={handleInputChange}
                      required
                      className="h-8 text-sm bg-slate-50/50 mt-2 animate-in fade-in"
                    />
                  )}
                </div>
              </div>
            </section>

            {/* SECTION 2: Fee Category */}
            <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 space-y-3">
              <div className="flex items-center gap-2 border-b pb-2">
                <Wallet className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-slate-800">
                  Fee Category
                </h3>
              </div>

              <RadioGroup
                onValueChange={handleFeeTypeChange}
                value={formData.feeType}
                required
                className="flex flex-wrap gap-3 md:gap-5 pt-1"
              >
                {feeOptions.map((fee) => (
                  <div
                    className="flex items-center space-x-2 cursor-pointer"
                    key={fee}
                  >
                    <RadioGroupItem
                      value={fee}
                      id={fee}
                      className="w-4 h-4 text-blue-600 border-slate-300"
                    />
                    <Label
                      htmlFor={fee}
                      className="cursor-pointer text-xs md:text-sm font-medium text-slate-700"
                    >
                      {fee}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {formData.feeType === "Others" && (
                <div className="mt-2 pt-2 animate-in fade-in border-t border-dashed border-slate-200">
                  <Label
                    htmlFor="otherFeeType"
                    className="text-xs text-slate-600 mb-1 block"
                  >
                    Specify Other Fee:
                  </Label>
                  <Input
                    type="text"
                    name="otherFeeType"
                    value={formData.otherFeeType}
                    placeholder="Details..."
                    onChange={handleInputChange}
                    required
                    className="h-8 text-sm max-w-sm bg-slate-50/50"
                  />
                </div>
              )}
            </section>

            {/* SECTION 3: Dynamic Items Table */}
            <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2">
                <div className="flex items-center gap-2">
                  <LayoutList className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-semibold text-slate-800">
                    Request Breakdown
                  </h3>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addRow}
                  className="h-7 text-xs border-dashed px-3"
                >
                  <Plus className="h-3 w-3 mr-1" /> Add Line
                </Button>
              </div>

              <div className="rounded-lg border border-slate-200 overflow-x-auto shadow-inner bg-slate-50/50">
                <Table className="text-sm">
                  <TableHeader className="bg-slate-100/80">
                    <TableRow className="hover:bg-transparent [&>th]:px-2 [&>th]:py-1 [&>th]:h-8 [&>th]:text-xs [&>th]:text-slate-600">
                      <TableHead className="min-w-[150px]">
                        Particulars
                      </TableHead>
                      {isListingFee && (
                        <>
                          <TableHead className="min-w-[100px]">SKU</TableHead>
                          <TableHead className="min-w-[100px]">Store</TableHead>
                        </>
                      )}
                      <TableHead className="w-[70px]">Qty</TableHead>
                      <TableHead className="w-[90px]">Unit Amt</TableHead>
                      <TableHead className="w-[100px]">Total Amt</TableHead>
                      <TableHead className="min-w-[100px]">Monthly</TableHead>
                      <TableHead className="min-w-[120px]">Remarks</TableHead>
                      <TableHead className="w-[40px] text-center"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow
                        key={index}
                        className="bg-white group [&>td]:p-1.5 hover:bg-slate-50/80 transition-colors"
                      >
                        <TableCell>
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
                            className="h-7 text-xs px-2"
                          />
                        </TableCell>
                        {isListingFee && (
                          <>
                            <TableCell className="animate-in fade-in">
                              <Input
                                type="text"
                                value={item.sku}
                                onChange={(e) =>
                                  handleItemChange(index, "sku", e.target.value)
                                }
                                required={isListingFee}
                                placeholder="SKU"
                                className="h-7 text-xs px-2"
                              />
                            </TableCell>
                            <TableCell className="animate-in fade-in">
                              <Input
                                type="text"
                                value={item.store}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "store",
                                    e.target.value,
                                  )
                                }
                                required={isListingFee}
                                placeholder="Store"
                                className="h-7 text-xs px-2"
                              />
                            </TableCell>
                          </>
                        )}
                        <TableCell>
                          <Input
                            type="number"
                            value={item.qty || ""}
                            onChange={(e) =>
                              handleItemChange(index, "qty", e.target.value)
                            }
                            required
                            className="h-7 text-xs px-2"
                          />
                        </TableCell>
                        <TableCell>
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
                            className="h-7 text-xs px-2"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.totalAmount}
                            readOnly
                            tabIndex={-1}
                            className="h-7 text-xs px-2 bg-slate-100/70 font-semibold text-slate-700 border-transparent shadow-none"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="text"
                            value={item.monthly}
                            onChange={(e) =>
                              handleItemChange(index, "monthly", e.target.value)
                            }
                            className="h-7 text-xs px-2"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="text"
                            value={item.remarks}
                            onChange={(e) =>
                              handleItemChange(index, "remarks", e.target.value)
                            }
                            className="h-7 text-xs px-2"
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          {items.length > 1 ? (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeRow(index)}
                              className="h-7 w-7 text-slate-400 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          ) : (
                            <div className="h-7 w-7"></div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow className="bg-slate-900 text-white hover:bg-slate-900 [&>td]:py-2 [&>td]:px-2">
                      <TableCell
                        colSpan={isListingFee ? 3 : 1}
                        className="text-right font-medium text-xs rounded-bl-lg"
                      >
                        Grand Total:
                      </TableCell>
                      <TableCell className="font-medium text-xs">
                        {totalQty}
                      </TableCell>
                      <TableCell className="font-medium text-xs">
                        {totalUnitAmount.toFixed(2)}
                      </TableCell>
                      <TableCell className="font-bold text-emerald-400 text-sm tracking-wide">
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

            {/* SECTION 4: Attachments */}
            <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 space-y-3">
              <div className="flex items-center gap-2 border-b pb-2">
                <Paperclip className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-slate-800">
                  Supporting Documents
                </h3>
              </div>
              <div className="space-y-1">
                <Label
                  htmlFor="attachments"
                  className="text-xs text-slate-600 font-medium"
                >
                  Upload Files (Optional)
                </Label>
                <Input
                  id="attachments"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="h-8 text-xs pt-1.5 cursor-pointer file:h-full file:bg-slate-100 file:text-xs file:font-medium file:border-0 file:mr-2 file:px-2 file:-my-1 hover:file:bg-slate-200 bg-slate-50/50"
                />
                <p className="text-[10px] text-slate-500">
                  You can select multiple files at once.
                </p>
              </div>
            </section>
          </div>

          {/* Submit Bar */}
          <div className="bg-slate-200/50 p-4 border-t border-slate-200 flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto min-w-[150px] bg-blue-600 hover:bg-blue-700 text-white h-9 text-sm rounded-lg shadow transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
