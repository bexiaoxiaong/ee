<template>
	<view class="page" ref="pageRef" :style="{ backgroundImage: 'url(' + bgUrl + ')' }">
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
				<view class="info-item">
					<text class="info-label">票种</text>
					<text class="info-value" @tap="editField('ticketType')">{{ ticketType }}</text>
				</view>
				<view class="info-item with-divider">
					<text class="info-label">票价</text>
					<text class="info-value" @tap="editField('ticketPrice')">{{ ticketPrice }}</text>
				</view>
				<view class="info-item with-divider">
					<text class="info-label">票位</text>
					<text class="info-value" @tap="editField('ticketSeat')">{{ ticketSeat }}</text>
				</view>
			</view>
		</view>

		<!-- 第4块：详细信息 -->
		<view class="detail-section">
			<view class="detail-title" @tap="onSaveTiket">详细资讯</view>
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

		<view class="footer-section" @tap="onPageTap">

		</view>
	</view>
</template>

<script>
	// 注意要安装此依赖或使用 HBuilderX 的二维码插件
	import {
		ref,
		onMounted
	} from 'vue'

	export default {
		onLoad() {
			this.generateQRCode('默认二维码内容');
		},
		data() {
			return {
				logoUrl: '/static/logo.png',
				qrUrl: '',
				bgUrl: '', // 当前背景图

				backgroundOptions: [{
						name: '蓝色星空',
						url: '/static/bg1.png'
					},
					{
						name: '城市夜景',
						url: '/static/bg2.png'
					},
					{
						name: '纯白背景',
						url: '/static/bg3.png'
					},
					{
						name: '没有背景',
						url: ''
					},
					{
						name: '自定义背景',
						url: null // Placeholder for custom image
					}
				],

				ticketNumber: '4311314',
				ticketType: '成人票',
				ticketPrice: '¥88',
				ticketSeat: 'A1',
				bookingNumber: 'T20250721001',
				eventName: '2025 成都音乐节',
				userName: '张三',
				pageRef: null
			}
		},
		mounted() {
			this.pageRef = this.$refs.pageRef;
		},
		methods: {
			
			async onSaveTiket() {
				if (!navigator.clipboard || !window.ClipboardItem) {
					uni.showModal({
						title: '提示',
						content: '当前浏览器不支持复制图片到剪贴板，请手动保存',
						showCancel: false
					});
					return;
				}
				
				
				uni.showActionSheet({
					itemList: ['复制', '保存'],
					success: async (res) => {
						if (!window.html2canvas) {
							return uni.showToast({
								title: '截图插件未加载',
								icon: 'none'
							});
						}

						const element = this.$refs.pageRef;
						const canvas = await html2canvas(element, {
							useCORS: true
						});
						
						// ✅ 保存
						if (res.tapIndex === 1) {
						 const dataUrl = canvas.toDataURL('image/png');
						
						  if (/iP(hone|od|ad)/.test(navigator.userAgent)) {
						    // iOS Safari 兼容处理
						    window.open(dataUrl, '_blank');
						    uni.showToast({
						      title: '长按图片保存',
						      icon: 'none'
						    });
						  } else {
						    const a = document.createElement('a');
						    a.href = dataUrl;
						    a.download = 'ticket.png';
						   document.body.appendChild(a); // 有些浏览器需要插入到 DOM
						   a.click();
						   document.body.removeChild(a);
						  }
						}

						// ✅ 复制
						if (res.tapIndex === 0) {
							canvas.toBlob(async (blob) => {
								if (!navigator.clipboard || !window.ClipboardItem) {
									return uni.showToast({
										title: '不支持剪贴板',
										icon: 'none'
									});
								}
								try {
									await navigator.clipboard.write([
										new ClipboardItem({
											'image/png': blob
										})
									]);
									uni.showToast({
										title: '已复制图片',
										icon: 'success'
									});
								} catch (err) {
									uni.showToast({
										title: '复制失败',
										icon: 'none'
									});
								}
							}, 'image/png');
						}
					}
				});
			},
			onPageTap(e) {
				this.selectBackground();
			},
			selectBackground() {
				const options = this.backgroundOptions.map(item => item.name);
				uni.showActionSheet({
					itemList: options,
					success: res => {
						const selected = this.backgroundOptions[res.tapIndex];
						if (selected.name === '自定义背景') {
							uni.chooseImage({
								count: 1,
								sizeType: ['original', 'compressed'],
								sourceType: ['album', 'camera'],
								success: (res) => {
									if (res.tempFilePaths.length > 0) {
										this.bgUrl = res.tempFilePaths[0];
									}
								}
							});
						} else {
							this.bgUrl = selected.url;
						}
					}
				});
			},
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
		min-height: 100vh;
		box-sizing: border-box;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
	}

	.section {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-shrink: 0;
		flex-direction: column;
	}

	/* logo */
	.logo-section {
		margin-bottom: -20rpx;
	}

	.logo {
		width: 100%;
		height: 120px;
		object-fit: cover;
	}

	/* 二维码 */
	.qr-section {
		margin-bottom: 20rpx;
	}

	.qr {
		width: 350rpx;
		height: 350rpx;
		border-radius: 12rpx;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
		background: #fff;
	}

	/* 票号和信息 */
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
		padding: 60rpx 20rpx 30rpx 20rpx;
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

	/* 详细信息 */
	.detail-section {
		width: 100%;
		padding: 24rpx;
		border-radius: 16rpx;
		box-sizing: border-box;
		margin: 20rpx 0;
	}

	.detail-row {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		margin-bottom: 16rpx;
	}

	.detail-title {
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
		margin-bottom: 10px;
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

	.divider {
		height: 1px;
		width: 100%;
		background-color: #e0e0e0;
		margin: 0rpx 0 10rpx 0;
	}

	.footer-section {
		height: 100px;
		width: 100%;
		background-color: ;
		padding: 24rpx;
		border-radius: 16rpx;
		box-sizing: border-box;
	}
</style>