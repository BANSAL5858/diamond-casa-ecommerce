from setuptools import setup, find_packages

setup(
    name="diamondcasa_jewellery",
    version="0.0.1",
    description="Diamond Casa Jewellery Frappe app",
    author="BANSAL5858",
    packages=find_packages(),
    include_package_data=True,
    install_requires=["frappe"],
    zip_safe=False,
)
