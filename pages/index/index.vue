<template>
	<view class="page">
		<!-- 第1块：logo -->
		<view class="section logo-section">
			<image class="logo" :src="logoUrl" @tap="changeImage"></image>
		</view>

		<!-- 第2块：二维码 -->
		<view class="section qr-section">
			<image :src="qrUrl" class="qr" @tap="changeQRCode"></image>
		</view>

		<!-- 第3块：票号和三栏信息 -->
		<view class="section ticket-section">
			<text class="ticket-text" @tap="changeTicketNumber">票券細號：{{ ticketNumber }}</text>

			<view class="ticket-info">
				<view class="info-item ">
					<text class="info-label">票种</text>
					<text class="info-value" @tap="editField('ticketType')">{{ ticketType }}</text>
				</view>
				<view class="info-item with-divider">
					<text class="info-label">票价</text>
					<text class="info-value" @tap="editField('ticketPrice')">{{ ticketPrice }}</text>
				</view>
				<view class="info-item with-divider ">
					<text class="info-label">票位</text>
					<text class="info-value" @tap="editField('ticketSeat')">{{ ticketSeat }}</text>
				</view>
			</view>
		</view>
		<!-- 新增 detail-section -->
		<view class="detail-section">
			<view class="detail-row">
				<text class="detail-label">订票编号</text>
				<text class="detail-value" @tap="editField('bookingNumber')">{{ bookingNumber }}</text>
			</view>
			<view class="divider"></view>
			<view class="detail-row">
				<text class="detail-label">活动名称</text>
				<text class="detail-value" @tap="editField('eventName')">{{ eventName }}</text>
			</view>
			<view class="divider"></view>
			<view class="detail-row">
				<text class="detail-label">姓名</text>
				<text class="detail-value" @tap="editField('userName')">{{ userName }}</text>
			</view>
		</view>
		<!-- 第5块：底部提示 -->
		<!-- <view class="section footer-section">
			<text class="footer-text">长按二维码保存</text>
		</view> -->
	</view>
</template>



<script>
	export default {
		onLoad() {
			this.generateQRCode('默认二维码内容');
		},
		data() {
			return {
				logoUrl: '/static/logo.png',
				qrUrl: '',
				ticketNumber: '4311314',
				ticketType: '成人票',
				ticketPrice: '¥88',
				ticketSeat: 'A1',
				bookingNumber: 'T20250721001',
				eventName: '2025 成都音乐节',
				userName: '张三'
			}
		},
		methods: {
			generateQRCode(text) {
				QRCode.toDataURL(text)
					.then(url => {
						this.qrUrl = url;
					})
					.catch(err => {
						console.error('生成二维码失败', err);
					});
			},
			changeQRCode() {
				uni.showModal({
					title: '输入二维码内容',
					editable: true,
					success: (res) => {
						if (res.confirm && res.content) {
							const input = res.content.trim();
							// ✅ 验证是否为完整的 https 链接
							const isValidHttps = /^https:\/\/[^\s]+$/.test(input);
							if (!isValidHttps) {
								uni.showToast({
									title: '请输入完整的 HTTPS 链接',
									icon: 'none'
								});
								return;
							}
							this.generateQRCode(input);
						}
					}
				});
			},
			changeImage() {
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						if (res.tempFilePaths.length > 0) {
							this.logoUrl = res.tempFilePaths[0];
						}
					}
				});
			},
			changeTicketNumber() {
				uni.showModal({
					title: '修改票券細號',
					content: '当前：' + this.ticketNumber,
					editable: true,
					placeholderText: '请输入新编号',
					success: (res) => {
						if (res.confirm && res.content) {
							this.ticketNumber = res.content;
						}
					}
				});
			},

			editField(field) {
				const fieldMap = {
					ticketType: '票种',
					ticketPrice: '票价',
					ticketSeat: '票位',
					bookingNumber: '订票编号',
					eventName: '活动名称',
					userName: '姓名'
				};
				uni.showModal({
					title: `修改${fieldMap[field]}`,
					editable: true,
					placeholderText: `请输入${fieldMap[field]}`,
					success: (res) => {
						if (res.confirm && res.content !== '') {
							this[field] = res.content;
						}
					}
				});
			}
		}
	}
</script>


<style>
	.page {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		padding: 40rpx 20rpx;
		min-height: 100vh;
		box-sizing: border-box;
		background-color: #fff;
	}

	.section {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-shrink: 0;
		flex-direction: column;
	}

	/* 第1块：logo */
	.logo-section {
		margin-bottom: 40rpx;
	}

	.logo {
		width: 100%;
		height: 120px;
		object-fit: cover;
	}

	/* 第2块：二维码 */
	.qr-section {
		margin-bottom: 20rpx;
	}

	.qr {
		width: 200rpx;
		height: 200rpx;
		border-radius: 12rpx;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
		background: #fff;
	}

	/* 第3块：票号和信息 */
	.ticket-section {
		margin-bottom: 60rpx;
		text-align: center;
	}

	.ticket-text {
		font-size: 30rpx;
		color: #333;
		text-decoration: underline;
		margin-bottom: 20rpx;
		cursor: pointer;
	}

	.ticket-info {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding-top: 60rpx;
		padding-right: 20rpx;
		padding-bottom: 30rpx;
		padding-left: 20rpx;
		box-sizing: border-box;
	}

	.info-item {
		width: 33.33%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	.with-divider {
		border-left: 1px solid #ccc;
	}

	.info-label {
		font-size: 24rpx;
		color: #999;
		margin-bottom: 8rpx;
	}

	.info-value {
		font-size: 28rpx;
		color: #333;
		font-weight: bold;
	}

	.detail-section {
		width: 100%;
		padding: 24rpx;
		/* background-color: #f8f8f8; */
		border-radius: 16rpx;
		box-sizing: border-box;
		margin: 20rpx 0;
	}

	.detail-row {
		display: flex;
		flex-direction: column;
		/* 垂直排列 */
		align-items: flex-start;
		/* 靠左对齐 */
		margin-bottom: 16rpx;
	}

	.detail-label {
		font-size: 26rpx;
		color: #888;
		margin-bottom: 4rpx;
	}

	.detail-value {
		font-size: 28rpx;
		color: #222;
		font-weight: bold;
	}


	/* 第5块：底部提示 */
	.footer-section {
		margin-top: auto;
		padding-bottom: 20rpx;
	}

	.footer-text {
		font-size: 24rpx;
		color: #888;
	}

	/* 横线分隔 */
	.divider {
		height: 1px;
		width: 100%;
		background-color: #e0e0e0;
		margin: 0rpx 0 10rpx 0;
	}
</style>