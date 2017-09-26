/**
 *   Wechaty - https://github.com/chatie/wechaty
 *
 *   @copyright 2016-2017 Huan LI <zixia@zixia.net>
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */
/**
 *
 * Ssl Key & Cert files.
 *
 * Hardcoded here, NO need to re-config.
 * because there will only be visit from 127.0.0.1
 * so it will not be a security issue.
 *
 * http://blog.mgechev.com/2014/02/19/create-https-tls-ssl-application-with-express-nodejs/
 * openssl req -x509 -days 3650 -nodes -newkey rsa:2048 -keyout key.pem -out cert.pem
 * openssl rsa -in key.pem -out newkey.pem && mv newkey.pem key.pem
 *
 * Reference:
 * What is a Pem file - http://serverfault.com/a/9717
 */
declare const key = "\n-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEAt1c10tCbJG5ydWPjBV5c4gA3f1/8ubhNnYj98dtFPR8a4VPk\nORCyst157tLq5uPgmlZLedAm08VFiDUwn8iGQI/RegQSuRjxaS2MccfP9jpzDazy\neMBi0mLg25z/4v9y/8N9nLSqbHrPrye+hzpSkSkyQ/zf/P85ZCdTGwCnFX6WlBQX\nI/3o5wWWRv4DaZTaLhChHjAa6+HJdYFvDvI6QUxggj3Vq64HsJv2xGvG7pZWjxXp\nFS0Mg8MQbHME1J92OwPNaqsNUY3JfPkaeYmfQi5Qy53ULGLxVgV0eyIFf6s4NSCr\nFI4PjJXyBWYCAlxVIUm1WdylIAl4MVvGADA1mQIDAQABAoIBAEOFUsU5HmnkYzLo\nfotTnVF+UvIOH70mKy+BbETOREmmUvf5NWvuwmEtP+K8utYdxnIQpetOxX3ogRsQ\nu7+c0hSk4rjVFzAkB4R8yeR9ehFspUK8FvBxqfNhhv5aa8Ll4SxgirpTrxAUirgv\nIvQafp4HVgPD9ZnvROulr+2Z5+7596qif4F1HrrxN6tl+cGNZFIZ7vk7uGsF8k4G\nLQ8xik8QABcTE4pKpRtNlesRpojSGI8cnu/z8MgDIPMHu6wgdz+OR1rZwNMuREZi\nzejf5gg82B1KxeFNEmtMI1GM+whKVkPBxwASJTOaiN2Oh7SdSO5SHxFv2bAxjJ6z\nSC4mwqECgYEA7YSIINzOTCkUGGcJrg14P0m1KxuoPFSoAXk61F6kwW1FQVPmfk4i\nn/MO8+2/CSAZiFEFNTUvWj5xM955wDVgSY8Z7l/aYxn11gGzV0XypsK77edTRrfp\n6AlvIepclSX5ocmhizHe4mrm8KaZ014qMtO3RUaoDA9h7zqQOK5OyxcCgYEAxZty\nDy7IxOBk3QfGdVqto/oDX2fQ6PTAIYwuOAh6rrQDkSXShPWI3bUJegylQeVOYG40\n3ti/fd/247OkFwPsPODNisWQTsdX5Kr4KWjmfTSpSDm1AkDvnuPk/tcyFhijxZ48\n6Q0ZL529oy7cwel3p3uzDIFbAMEdATKIRp9css8CgYAkJNfmUFOgaVvifsONVgVn\ndBr6rWHDlIpgdwdJzAE8Yhl44ICh1dgVCRLMcfBxPg5EnTeyqh5DmF73qrJSWo0F\nhJ5IlRORoyCy6V1WOZG8aMPaZypYB6KzqcPcoGJoW/gJ87n+iZ9GS0hLdL7R2HGJ\nfIhWJXNrKmgX1Iyf436gDwKBgQC57ekEICEIHZrJ3eb9xLRc9YD249fNWXzuE9fp\nIRFOEFLK36uVLvH4qb6g+AUGW5vDX+6fP5Ht/i1vUjey8B33qg275OhDN42busKF\nNA6rAEHHk4Sc+jx8ZDGzFwgpgkWWS61EGu73vpQQVqegTOwoyltOCOh3bTy9Q661\nxHyUQQKBgA1vFFy09wJmQNCoo2kLvghkyPHrBXQlzoRW3cafw+vwoYZFukxst0dd\n2mQ3CyRJ7buoDdj0cFVlScB7KSQtIvLMtAn6tkL6ecooep346OSoLlsQd/F5ODep\nbBdRj0Orj7xQDeIicM7ASTYPAivh9NTu4yJL0r/YOX3OvXxaBSGf\n-----END RSA PRIVATE KEY-----\n";
declare const cert = "\n-----BEGIN CERTIFICATE-----\nMIIDXTCCAkWgAwIBAgIJAKMz7h5gRwqgMA0GCSqGSIb3DQEBCwUAMEUxCzAJBgNV\nBAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhJbnRlcm5ldCBX\naWRnaXRzIFB0eSBMdGQwHhcNMTYwNTAxMTUyNzM5WhcNMTcwNTAxMTUyNzM5WjBF\nMQswCQYDVQQGEwJBVTETMBEGA1UECAwKU29tZS1TdGF0ZTEhMB8GA1UECgwYSW50\nZXJuZXQgV2lkZ2l0cyBQdHkgTHRkMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIB\nCgKCAQEAt1c10tCbJG5ydWPjBV5c4gA3f1/8ubhNnYj98dtFPR8a4VPkORCyst15\n7tLq5uPgmlZLedAm08VFiDUwn8iGQI/RegQSuRjxaS2MccfP9jpzDazyeMBi0mLg\n25z/4v9y/8N9nLSqbHrPrye+hzpSkSkyQ/zf/P85ZCdTGwCnFX6WlBQXI/3o5wWW\nRv4DaZTaLhChHjAa6+HJdYFvDvI6QUxggj3Vq64HsJv2xGvG7pZWjxXpFS0Mg8MQ\nbHME1J92OwPNaqsNUY3JfPkaeYmfQi5Qy53ULGLxVgV0eyIFf6s4NSCrFI4PjJXy\nBWYCAlxVIUm1WdylIAl4MVvGADA1mQIDAQABo1AwTjAdBgNVHQ4EFgQU/Sed0ljf\nHEpQsmReiphJnSsPTFowHwYDVR0jBBgwFoAU/Sed0ljfHEpQsmReiphJnSsPTFow\nDAYDVR0TBAUwAwEB/zANBgkqhkiG9w0BAQsFAAOCAQEAXjqJfXSEwVktRmeB+tW0\nF837NEfzyedP82gSCCC+pbs+4E6DbDANupxP8vqIfqTe03YScZHVR/ha/f/WPLpc\nHvDuyOSXrms9x0OHxsH70Ajx5/JBWyBbtFdox6yCEoeydOXl+MQDXgnGGv8VFXdN\ndd2RP6/Ovx88hYGWcwf4RekTrbsM40n7BkkCCEedZPy7ouRmAs2FXpd+cm3zD9jt\nBas7b0wEOA7H2HejkbFOUierE40Kzh72vDD7M6DqUZFSvClY0O0+EYefB5TiRsN0\ng+Xdc4Ag/St5eqgrp95KOlVeepSlb35LAD1Cc91LddTXCYS7+dc4ndQYpgrLU0ru\nSw==\n-----END CERTIFICATE-----\n";
export { cert, key };
