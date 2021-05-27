export default async () => {
  console.log('Getting USB devices')
  navigator.usb.getDevices().then((devices) => {
    if (!devices || !devices.length) {
      console.log('No allowed devices found')
      return
    }
    const vendor = localStorage.getItem('usbVendor')
    const serial = localStorage.getItem('usbSerial')
    if (!vendor || !serial) {
      console.log('No allowed devices match the registered device.')
      return
    }
    const device = devices.find(
      (x) => x.vendorId === parseInt(vendor) && x.serialNumber === serial,
    )
    console.log(device)
    console.log(
      `Device found: ${device.manufacturerName} - ${device.productName} - ${device.serialNumber}`,
    )
    device
      .open()
      .then(() => device.selectConfiguration(1))
      .then((res) => console.log(res))
  })
}
