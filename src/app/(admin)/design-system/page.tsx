'use client'

/**
* Bitcoin BAI Design System — Demo Page
 * Phase DS-001
 *
 * This page demonstrates every component in the design system.
 * It is NOT a business page — it only showcases reusable UI.
 */

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Textarea,
  Select,
  Checkbox,
  RadioGroup,
  RadioGroupItem,
  Switch,
  Badge,
  StatusBadge,
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  Popover,
  PopoverTrigger,
  PopoverContent,
  StatCard,
  WalletCard,
  MetricCard,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Drawer,
  DrawerTrigger,
  DrawerContent,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
  Pagination,
  SearchInput,
  Alert,
  EmptyState,
  Skeleton,
  LoadingOverlay,
  Progress,
  Stepper,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TransactionStatus,
  TransactionBadge,
  NetworkStatus,
  BitcoinAddress,
  AmountDisplay,
  DateDisplay,
  CopyButton,
  Container,
  Stack,
  Divider,
  ScrollArea,
} from '@/components'
import {
  Wallet,
  Users,
} from 'lucide-react'

export default function DesignSystemPage() {
  return (
    <Container maxWidth="7xl" padding="lg">
      <Stack spacing="lg">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-text-primary">
            Bitcoin BAI Design System
          </h1>
          <p className="text-text-secondary">
            Phase DS-001 — Reusable UI Components
          </p>
        </div>

        {/* Foundation */}
        <Card>
          <CardHeader>
            <CardTitle>Foundation</CardTitle>
          </CardHeader>
          <CardContent>
            <Stack direction="horizontal" spacing="lg" align="center">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-accent" />
                <span className="text-sm">Accent (Gold)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-success" />
                <span className="text-sm">Success</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-warning" />
                <span className="text-sm">Warning</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-danger" />
                <span className="text-sm">Danger</span>
              </div>
            </Stack>
          </CardContent>
        </Card>

        {/* Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
          </CardHeader>
          <CardContent>
            <Stack direction="horizontal" spacing="md" align="center">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="link">Link</Button>
              <Button variant="primary" isLoading>
                Loading
              </Button>
              <Button variant="primary" disabled>
                Disabled
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Form Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Form Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <Stack spacing="md">
              <Input placeholder="Enter your name" />
              <Textarea placeholder="Enter your message" />
              <Select
                options={[
                  { value: '1', label: 'Option 1' },
                  { value: '2', label: 'Option 2' },
                ]}
                placeholder="Select an option"
              />
              <Stack direction="horizontal" spacing="md" align="center">
                <Checkbox id="terms" />
                <label htmlFor="terms" className="text-sm">
                  Accept terms
                </label>
              </Stack>
              <RadioGroup>
                <Stack direction="horizontal" spacing="md">
                  <RadioGroupItem value="1" id="r1" />
                  <label htmlFor="r1" className="text-sm">
                    Option 1
                  </label>
                  <RadioGroupItem value="2" id="r2" />
                  <label htmlFor="r2" className="text-sm">
                    Option 2
                  </label>
                </Stack>
              </RadioGroup>
              <Switch id="notifications" />
            </Stack>
          </CardContent>
        </Card>

        {/* Badges & Status */}
        <Card>
          <CardHeader>
            <CardTitle>Badges & Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Stack direction="horizontal" spacing="md" align="center">
              <Badge variant="gold">Gold</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="destructive">Danger</Badge>
              <Badge variant="info">Info</Badge>
              <StatusBadge status="success" />
              <StatusBadge status="warning" />
              <StatusBadge status="danger" />
              <TransactionStatus status="completed" />
              <TransactionStatus status="pending" />
              <TransactionStatus status="failed" />
              <TransactionBadge type="deposit" />
              <TransactionBadge type="withdrawal" />
              <NetworkStatus status="online" />
              <NetworkStatus status="offline" />
            </Stack>
          </CardContent>
        </Card>

        {/* Data Display */}
        <Card>
          <CardHeader>
            <CardTitle>Data Display</CardTitle>
          </CardHeader>
          <CardContent>
            <Stack spacing="md">
              <BitcoinAddress address="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" />
              <AmountDisplay amount={1.23456789} />
              <DateDisplay date={new Date()} relative />
              <CopyButton text="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" />
            </Stack>
          </CardContent>
        </Card>

        {/* Cards */}
        <Card>
          <CardHeader>
            <CardTitle>Cards</CardTitle>
          </CardHeader>
          <CardContent>
            <Stack direction="horizontal" spacing="lg">
              <StatCard
                title="Total Balance"
                value="1.234 BTC"
                change="+5.2% from last month"
                changeType="increase"
                icon={<Wallet className="h-4 w-4" />}
              />
              <WalletCard
                title="Bitcoin Wallet"
                balance="1.234"
                status="active"
                icon={<Wallet className="h-4 w-4" />}
              />
              <MetricCard
                title="Active Users"
                value="1,234"
                icon={<Users className="h-4 w-4" />}
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Overlays */}
        <Card>
          <CardHeader>
            <CardTitle>Overlays</CardTitle>
          </CardHeader>
          <CardContent>
            <Stack direction="horizontal" spacing="md" align="center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Dialog Title</DialogTitle>
                    <DialogDescription>
                      This is a dialog description.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="secondary">Cancel</Button>
                    <Button>Confirm</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="outline">Drawer</Button>
                </DrawerTrigger>
                <DrawerContent>
                  <CardHeader>
                    <CardTitle>Drawer Content</CardTitle>
                  </CardHeader>
                </DrawerContent>
              </Drawer>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">Popover</Button>
                </PopoverTrigger>
                <PopoverContent>
                  <p className="text-sm">Popover content</p>
                </PopoverContent>
              </Popover>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline">Tooltip</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Tooltip text</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Stack>
          </CardContent>
        </Card>

        {/* Navigation */}
        <Card>
          <CardHeader>
            <CardTitle>Navigation</CardTitle>
          </CardHeader>
          <CardContent>
            <Stack spacing="md">
              <Tabs defaultValue="tab1">
                <TabsList>
                  <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                  <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1">Tab 1 content</TabsContent>
                <TabsContent value="tab2">Tab 2 content</TabsContent>
              </Tabs>

              <Accordion type="single" defaultValue="item1">
                <AccordionItem value="item1">
                  <AccordionTrigger>Accordion Item 1</AccordionTrigger>
                  <AccordionContent>
                    Content for accordion item 1.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Design System</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <Pagination
                currentPage={1}
                totalPages={10}
                onPageChange={() => {}}
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Feedback */}
        <Card>
          <CardHeader>
            <CardTitle>Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <Stack spacing="md">
              <Alert variant="success" title="Success!">
                Your action was completed successfully.
              </Alert>
              <Alert variant="warning" title="Warning">
                Please review your input before proceeding.
              </Alert>
              <Alert variant="danger" title="Error">
                Something went wrong. Please try again.
              </Alert>
              <LoadingOverlay isLoading message="Loading data..." />
              <Progress value={60} max={100} />
              <Stepper
                steps={[
                  { label: 'Step 1', description: 'First step' },
                  { label: 'Step 2', description: 'Second step' },
                  { label: 'Step 3', description: 'Third step' },
                ]}
                currentStep={1}
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Layout */}
        <Card>
          <CardHeader>
            <CardTitle>Layout</CardTitle>
          </CardHeader>
          <CardContent>
            <Stack spacing="md">
              <SearchInput placeholder="Search..." value="" onValueChange={() => {}} />
              <Divider label="Or" />
              <ScrollArea className="h-40">
                <Stack spacing="sm">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-10 rounded bg-surface-elevated"
                    />
                  ))}
                </Stack>
              </ScrollArea>
            </Stack>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Table</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Bitcoin Deposit</TableCell>
                  <TableCell>
                    <TransactionStatus status="completed" />
                  </TableCell>
                  <TableCell>
                    <AmountDisplay amount={0.5} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Bitcoin Withdrawal</TableCell>
                  <TableCell>
                    <TransactionStatus status="pending" />
                  </TableCell>
                  <TableCell>
                    <AmountDisplay amount={0.1} />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Empty State */}
        <Card>
          <CardHeader>
            <CardTitle>Empty State</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              title="No data yet"
              description="Your data will appear here once you have some."
            />
          </CardContent>
        </Card>

        {/* Skeleton */}
        <Card>
          <CardHeader>
            <CardTitle>Loading States</CardTitle>
          </CardHeader>
          <CardContent>
            <Stack spacing="md">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  )
}
