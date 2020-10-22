# Overview
## Electronic Vendor Database (e.g., Best Buy)
The application is an electronics vendor that operates both a Website and a chain of many physical stores. Examples include Best Buy and Circuit City. To find out more about this application, think about any experiences you may have had making purchases both online and instore, and browse their Web sites.
In our hypothetical company, it has been decided to redesign a major part of the database that underlies company operations. Unfortunately, the manager assigned to solicit database design proposals is not very computer literate and is unable to provide a very detailed specification at the technical level. Fortunately, you are able to do that

Here are a few  points to consider
* There are many different products, grouped into a variety of (possibly overlapping) categories. Groupings can by type of product (cameras, phones, etc.), by manufacturer (Sony, Apple, etc.), or by other means (for example, a Gateway PC might be packaged with a Sony monitor and an HP printer and marketed as a package).
* Some customers have a contract with the company and bill their purchases to an account number. They are billed monthly. Other customers are infrequent customers and pay with a credit or debit card. Card information may be stored for online customers, but not for in-store customers.
* Online sales must be sent to a shipper. The company needs to store the tracking number for the shipping company so it can respond to customer inquiries.
* Inventory must be accurate both in stores and in warehouses used to replenish stores and to ship to online customers. When inventory is low, a reorder should be sent to the manufacturer and listed in the database. When goods arrive, inventory should be updated and reorders marked as having been filled.
* Sales data are important for corporate planning. Marketers may want to look at sales data by time period, product, product grouping, season, region (for stores), etc.

# Application
The application should be developed for only one electronic vendor (e.g., Best Buy). It should support the following actions:
* Every customer can register an account with an email and will be assigned an ID (as a frequent customer). If one customer purchases multiple products from the website and physical stores, the same ID is used. Note that frequent customers can also purchase as infrequent customers.
* A frequent customer holding an account can register/modify/delete the information for their account.
* A frequent customer can complete his/her transaction online (including shipping), and check his/her purchase history from both website and the physical stores, as well as the stock information of different products available for purchase (both online and physical stores).
* Infrequent customers can complete their online transactions using their credit cards. Before each purchase, the system checks that if the customer has enough available credit for the purchase (assuming that the available credit is also maintained by the electronic vendor).

 Note that the application does not necessarily include the functions for the sales data analysis, but the backend database should store such information for future decision support. If you would like to add more features in the application, please feel free to do so.