export default function Logo({height = '20vmin'}) {
    return (
        <img
            alt="UMC"
            src={chrome.runtime.getURL('logo/128.png')}
            style={{ height: height }}
            className="mx-auto w-auto"
        />
    )
}