Param(
    [Parameter(Mandatory = $true)]
    [System.IO.FileInfo]$file
)

try {
    $libPathEcma = $PSScriptRoot + "\..\lib\EcmaScript.NET.2.0.0\lib\netstandard2.0\EcmaScript.NET.dll"
    Add-Type -Path $libPathEcma | Out-Null

    $libPath = $PSScriptRoot + "\..\lib\YUICompressor.NET.3.0.0\lib\netstandard2.0\Yahoo.Yui.Compressor.dll"
    Add-Type -Path $libPath | Out-Null

    try {
        $jsCompressor = New-Object -TypeName Yahoo.Yui.Compressor.JavaScriptCompressor
        $content = [IO.File]::ReadAllText($file.FullName)
        $compressedContent = $jsCompressor.Compress($content)
        Set-ItemProperty $file.FullName -name IsReadOnly -value $false
        [IO.File]::WriteAllText($file.FullName, $compressedContent)
        Set-ItemProperty $file.FullName -name IsReadOnly -value $true
    }
    catch [EcmaScript.NET.EcmaScriptRuntimeException] {
        Write-Warning "File: $($file.FullName)`nMessage: $($_)`nLineNumber: $($_.Exception.LineNumber)`nLineSource: $($_.Exception.LineSource)`nColumnNumber: $($_.Exception.ColumnNumber)"
    }
}
catch [System.Reflection.ReflectionTypeLoadException] {
    Write-Error "Message: $($_.Exception.Message)`nStackTrace: $($_.Exception.StackTrace)`nLoaderExceptions: $($_.Exception.LoaderExceptions)"
}