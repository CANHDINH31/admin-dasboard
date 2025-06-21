import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  Query,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { FakeOrdersSeed } from './seeds/fake-orders.seed';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly fakeOrdersSeed: FakeOrdersSeed,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Post('seed')
  @ApiOperation({ summary: 'Seed fake orders data' })
  @ApiResponse({ status: 201, description: 'Orders seeded successfully' })
  async seed() {
    return this.fakeOrdersSeed.seed();
  }

  @Get()
  @ApiOperation({
    summary: 'Get all orders with pagination and comprehensive filtering',
  })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (default: 1)',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page (default: 25)',
    type: Number,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search term for PO number or Name',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Filter by order date start (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Filter by order date end (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'account',
    required: false,
    description: 'Filter by account (orderNumEmail)',
  })
  @ApiQuery({
    name: 'trackingStatus',
    required: false,
    description: 'Filter by tracking status',
  })
  @ApiQuery({
    name: 'sku',
    required: false,
    description: 'Filter by SKU',
  })
  @ApiQuery({
    name: 'shipByStart',
    required: false,
    description: 'Filter by ship by date start (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'shipByEnd',
    required: false,
    description: 'Filter by ship by date end (YYYY-MM-DD)',
  })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 25,
    @Query('search') search?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('account') account?: string,
    @Query('trackingStatus') trackingStatus?: string,
    @Query('sku') sku?: string,
    @Query('shipByStart') shipByStart?: string,
    @Query('shipByEnd') shipByEnd?: string,
  ) {
    return this.ordersService.findAll(
      Number(page),
      Number(limit),
      search,
      startDate,
      endDate,
      account,
      trackingStatus,
      sku,
      shipByStart,
      shipByEnd,
    );
  }

  @Get('filter/order-number')
  @ApiOperation({ summary: 'Filter orders by order number' })
  @ApiResponse({ status: 200, description: 'Orders filtered successfully' })
  @ApiQuery({
    name: 'orderNumber',
    required: true,
    description: 'Filter by order number',
  })
  findByOrderNumber(@Query('orderNumber') orderNumber: string) {
    return this.ordersService.findByOrderNumber(orderNumber);
  }

  @Get('filter/po-number')
  @ApiOperation({ summary: 'Filter orders by PO number' })
  @ApiResponse({ status: 200, description: 'Orders filtered successfully' })
  @ApiQuery({
    name: 'poNumber',
    required: true,
    description: 'Filter by PO number',
  })
  findByPoNumber(@Query('poNumber') poNumber: string) {
    return this.ordersService.findByPoNumber(poNumber);
  }

  @Get('filter/tracking-status')
  @ApiOperation({ summary: 'Filter orders by tracking status' })
  @ApiResponse({ status: 200, description: 'Orders filtered successfully' })
  @ApiQuery({
    name: 'trackingStatus',
    required: true,
    description: 'Filter by tracking status',
  })
  findByTrackingStatus(@Query('trackingStatus') trackingStatus: string) {
    return this.ordersService.findByTrackingStatus(trackingStatus);
  }

  @Get('filter/sku')
  @ApiOperation({ summary: 'Filter orders by SKU' })
  @ApiResponse({ status: 200, description: 'Orders filtered successfully' })
  @ApiQuery({
    name: 'sku',
    required: true,
    description: 'Filter by SKU',
  })
  findBySku(@Query('sku') sku: string) {
    return this.ordersService.findBySku(sku);
  }

  @Get('filter/date-range')
  @ApiOperation({ summary: 'Filter orders by date range' })
  @ApiResponse({ status: 200, description: 'Orders filtered successfully' })
  @ApiQuery({
    name: 'startDate',
    required: true,
    description: 'Filter by order date start',
  })
  @ApiQuery({
    name: 'endDate',
    required: true,
    description: 'Filter by order date end',
  })
  findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.ordersService.findByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('filter/ship-by-date-range')
  @ApiOperation({ summary: 'Filter orders by ship by date range' })
  @ApiResponse({ status: 200, description: 'Orders filtered successfully' })
  @ApiQuery({
    name: 'shipByStart',
    required: true,
    description: 'Filter by ship by date start',
  })
  @ApiQuery({
    name: 'shipByEnd',
    required: true,
    description: 'Filter by ship by date end',
  })
  findByShipByDateRange(
    @Query('shipByStart') shipByStart: string,
    @Query('shipByEnd') shipByEnd: string,
  ) {
    return this.ordersService.findByShipByDateRange(
      new Date(shipByStart),
      new Date(shipByEnd),
    );
  }

  @Get('filter/high-profit')
  @ApiOperation({ summary: 'Filter orders by minimum profit' })
  @ApiResponse({ status: 200, description: 'Orders filtered successfully' })
  @ApiQuery({
    name: 'minProfit',
    required: true,
    description: 'Filter by minimum profit',
    type: Number,
  })
  findHighProfitOrders(@Query('minProfit') minProfit: string) {
    return this.ordersService.findHighProfitOrders(parseFloat(minProfit));
  }

  @Get('filter/high-roi')
  @ApiOperation({ summary: 'Filter orders by minimum ROI' })
  @ApiResponse({ status: 200, description: 'Orders filtered successfully' })
  @ApiQuery({
    name: 'minROI',
    required: true,
    description: 'Filter by minimum ROI',
    type: Number,
  })
  findHighROIOrders(@Query('minROI') minROI: string) {
    return this.ordersService.findHighROIOrders(parseFloat(minROI));
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get order statistics' })
  @ApiResponse({
    status: 200,
    description: 'Order statistics retrieved successfully',
  })
  getStats() {
    return this.ordersService.getOrderStats();
  }

  @Get('stats/tracking-status')
  @ApiOperation({ summary: 'Get tracking status statistics' })
  @ApiResponse({
    status: 200,
    description: 'Tracking status statistics retrieved successfully',
  })
  getTrackingStatusStats() {
    return this.ordersService.getTrackingStatusStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update order' })
  @ApiResponse({ status: 200, description: 'Order updated successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete order' })
  @ApiResponse({ status: 200, description: 'Order deleted successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
